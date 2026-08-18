import bpy
import math
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(ROOT, "public", "maps", "models")
os.makedirs(OUT_DIR, exist_ok=True)


def clear():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.materials:
        bpy.data.materials.remove(block)


def material(name, color, metallic=0.0, roughness=0.55, emission=None, transmission=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if transmission:
        bsdf.inputs["Transmission Weight"].default_value = transmission
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = 1.25
    return mat


def cube(name, loc, scale, mat, bevel=0.06):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = obj.modifiers.new("Architectural edge", "BEVEL")
        mod.width = bevel
        mod.segments = 3
    obj.data.materials.append(mat)
    return obj


def cylinder(name, loc, radius, depth, mat, vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    return obj


def mansard(name, loc, width, depth, height, mat):
    mesh = bpy.data.meshes.new(name + "Mesh")
    w, d = width / 2, depth / 2
    inset = min(width, depth) * 0.2
    verts = [(-w,-d,0),(w,-d,0),(w,d,0),(-w,d,0),(-w+inset,-d+inset,height),(w-inset,-d+inset,height),(w-inset,d-inset,height),(-w+inset,d-inset,height)]
    faces = [(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7),(4,5,6,7)]
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(mat)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    bevel = obj.modifiers.new("Roof seams", "BEVEL")
    bevel.width = 0.04
    bevel.segments = 2
    return obj


def arch(name, loc, radius, depth, mat, rotation=(math.pi/2, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=0.12, major_segments=36, minor_segments=10, location=loc, rotation=rotation, abso_major_rad=1.25, abso_minor_rad=0.12)
    obj = bpy.context.object
    obj.name = name
    obj.scale.z = depth
    obj.data.materials.append(mat)
    return obj


def window(x, y, z, glass, trim, width=0.32, height=0.58):
    cube("French window", (x, y, z), (width, 0.045, height), glass, 0.025)
    cube("Window sill", (x, y - 0.055, z - height - 0.06), (width + 0.1, 0.08, 0.055), trim, 0.018)
    cube("Window lintel", (x, y - 0.055, z + height + 0.06), (width + 0.1, 0.08, 0.055), trim, 0.018)
    cube("Window mullion", (x, y - 0.06, z), (0.028, 0.06, height), trim, 0.012)


def facade(width, y, floors, columns, glass, trim, start=1.15, spacing=1.32, gate=True):
    for floor in range(floors):
        for col in range(columns):
            x = -width * 0.39 + col * (width * 0.78 / (columns - 1))
            if gate and floor == 0 and abs(x) < 0.75:
                continue
            window(x, y, start + floor * spacing, glass, trim)


def columns(xs, y, z, height, stone):
    for x in xs:
        cylinder("Corinthian column", (x, y, z), 0.13, height, stone, 24)
        cylinder("Column base", (x, y, z-height/2), 0.19, 0.14, stone, 24)
        cylinder("Column capital", (x, y, z+height/2), 0.2, 0.18, stone, 24)


def optimize_scene():
    """Bake modifiers and collapse the building into one multi-material mesh.

    The visual result stays identical while WebGL submits dramatically fewer
    individual draw objects, which matters most on phones.
    """
    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not mesh_objects:
        return
    bpy.ops.object.select_all(action="DESELECT")
    for obj in mesh_objects:
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        for modifier in list(obj.modifiers):
            try:
                bpy.ops.object.modifier_apply(modifier=modifier.name)
            except RuntimeError:
                pass
    bpy.context.view_layer.objects.active = mesh_objects[0]
    bpy.ops.object.join()
    bpy.context.object.name = "Optimized Paris landmark"


def export(name):
    optimize_scene()
    bpy.ops.object.select_all(action="SELECT")
    path = os.path.join(OUT_DIR, name + ".glb")
    bpy.ops.export_scene.gltf(filepath=path, export_format="GLB", export_apply=True, export_materials="EXPORT", export_yup=True)
    print("EXPORTED", path)


def palette():
    return {
        "stone": material("Paris limestone", (0.55, 0.40, 0.25), roughness=0.72),
        "trim": material("Carved limestone", (0.78, 0.64, 0.43), roughness=0.64),
        "slate": material("Slate roof", (0.03, 0.042, 0.052), roughness=0.42),
        "zinc": material("Paris zinc", (0.20, 0.24, 0.25), metallic=0.72, roughness=0.34),
        "glass": material("Warm glass", (0.065, 0.095, 0.11), metallic=0.08, roughness=0.18, emission=(0.9,0.38,0.08)),
        "door": material("Oak", (0.09, 0.027, 0.012), roughness=0.58),
        "market_glass": material("Grand glass", (0.16,0.32,0.34), metallic=0.2, roughness=0.12, transmission=0.48),
    }


def civic(style):
    clear(); m = palette()
    width = 10.5 if style == "university" else 8.8
    height = 5.3 if style == "university" else 4.7
    depth = 5.6 if style == "university" else 4.8
    cube("Main Paris facade", (0,0,height/2), (width/2,depth/2,height/2), m["stone"], 0.1)
    mansard("Paris mansard", (0,0,height), width+0.35, depth+0.35, 1.75, m["slate"])
    facade(width, -depth/2-0.04, 3, 7 if style == "university" else 6, m["glass"], m["trim"], 1.05, 1.45)
    cube("Cornice", (0,-depth/2-0.12,height-0.3), (width/2+0.12,0.18,0.13), m["trim"], 0.025)
    cube("Grand entrance", (0,-depth/2-0.13,1.28), (0.65,0.1,1.28), m["door"], 0.06)
    columns([-1.35,-0.9,0.9,1.35], -depth/2-0.31, 2.35, 3.7, m["trim"])
    cube("Portico", (0,-depth/2-0.32,4.22), (1.7,0.42,0.17), m["trim"], 0.04)
    for x in (-3.5,-1.75,0,1.75,3.5):
        cube("Dormer", (x,-depth/2+0.06,height+0.66),(0.34,0.31,0.42),m["trim"],0.04)
        window(x,-depth/2-0.27,height+0.66,m["glass"],m["trim"],0.2,0.25)
    for step in range(4):
        cube("Entry step", (0,-depth/2-0.65-step*0.3,0.08+step*0.08),(1.5+step*0.3,0.28,0.08),m["trim"],0.025)
    export("paris-" + style)


def market():
    clear(); m = palette()
    cube("Market stone base", (0,0,0.65),(5.6,3.3,0.65),m["stone"],0.1)
    # Grand arched glass nave
    for x in [i * 1.35 - 5.4 for i in range(9)]:
        arch("Iron roof rib", (x,0,3.35), 2.55, 1, m["zinc"], (0,math.pi/2,0))
    cube("Glass hall", (0,0,2.55),(5.5,2.35,1.85),m["market_glass"],0.08)
    for x in (-5.45,-3.6,-1.8,0,1.8,3.6,5.45):
        columns([x], -3.35, 2.0, 2.7, m["trim"])
    cube("Market entrance", (0,-3.38,1.55),(0.9,0.1,1.5),m["door"],0.07)
    export("paris-market")


def station():
    clear(); m = palette()
    cube("Station base", (0,0,0.6),(6.3,3.4,0.6),m["stone"],0.09)
    cube("Station concourse", (0,0,2.2),(6.1,2.8,1.6),m["market_glass"],0.08)
    for x in [i * 1.2 - 6 for i in range(11)]:
        arch("Station steel vault", (x,0,3.7),2.85,1,m["zinc"],(0,math.pi/2,0))
    cube("Stone front", (0,-2.92,2.15),(6.25,0.3,1.75),m["stone"],0.08)
    for x in (-4.8,-3.2,-1.6,0,1.6,3.2,4.8):
        window(x,-3.24,2.3,m["glass"],m["trim"],0.4,0.8)
    cube("Station door", (0,-3.27,1.25),(0.8,0.1,1.2),m["door"],0.06)
    columns([-1.15,1.15],-3.4,2.0,3.6,m["trim"])
    cylinder("Clock",(0,-3.37,4.05),0.65,0.12,m["trim"],40)
    export("paris-station")


def hotel():
    clear(); m = palette()
    cube("Hotel body",(0,0,3.4),(4.6,2.5,3.4),m["stone"],0.1)
    mansard("Hotel mansard",(0,0,6.8),9.5,5.3,2.0,m["slate"])
    facade(9.2,-2.55,4,7,m["glass"],m["trim"],1.05,1.42)
    cube("Hotel entrance",(0,-2.65,1.25),(0.7,0.1,1.25),m["door"],0.06)
    cube("Hotel balcony",(0,-2.82,3.9),(2.1,0.38,0.12),m["trim"],0.03)
    columns([-1.55,1.55],-2.75,2.25,3.6,m["trim"])
    export("paris-hotel")


def hospital():
    clear(); m = palette()
    white = material("Hospital pale limestone", (0.78, 0.78, 0.71), roughness=0.68)
    medical_glass = material("Hospital glass", (0.08, 0.25, 0.27), metallic=0.08, roughness=0.16, transmission=0.18)
    red = material("Medical red", (0.55, 0.025, 0.018), roughness=0.48)
    cube("Historic hospital body", (0,0,2.75), (4.8,2.55,2.75), white, 0.1)
    mansard("Hospital slate roof", (0,0,5.5), 10.0, 5.45, 1.45, m["slate"])
    facade(9.6,-2.59,3,7,medical_glass,m["trim"],1.05,1.45)
    cube("Hospital entrance glass", (0,-2.72,1.35),(1.2,0.18,1.35),medical_glass,0.06)
    cube("Hospital entrance canopy", (0,-3.15,2.72),(1.65,0.78,0.12),m["zinc"],0.04)
    columns([-1.75,1.75],-2.82,2.15,3.45,m["trim"])
    # Large unmistakable medical cross integrated into the facade.
    cube("Medical cross vertical", (0,-2.94,4.5),(0.22,0.08,0.82),red,0.025)
    cube("Medical cross horizontal", (0,-2.95,4.5),(0.68,0.08,0.22),red,0.025)
    # Modern clinical wings distinguish it from the university.
    for side in (-1, 1):
        cube("Clinical glass wing", (side*5.55,0.25,2.0),(0.8,2.1,2.0),medical_glass,0.08)
        for floor in (0.9, 2.05, 3.2):
            cube("Wing limestone band", (side*5.55,-1.9,floor),(0.88,0.09,0.08),white,0.02)
    export("paris-hospital")


def police():
    clear(); m = palette()
    blue = material("Police blue enamel", (0.018, 0.08, 0.16), metallic=0.2, roughness=0.34)
    cube("Police headquarters", (0,0,2.45),(4.55,2.45,2.45),m["stone"],0.1)
    mansard("Police slate roof", (0,0,4.9),9.45,5.2,1.5,m["slate"])
    facade(9.1,-2.49,3,7,m["glass"],m["trim"],0.95,1.3)
    cube("Police central portal", (0,-2.65,1.35),(0.8,0.12,1.35),blue,0.055)
    columns([-1.35,-0.92,0.92,1.35],-2.8,2.15,3.45,m["trim"])
    cube("Police portico", (0,-2.84,3.95),(1.75,0.42,0.18),m["trim"],0.03)
    # Central watch tower, clock and blue beacon.
    cube("Watch tower", (0,0,6.2),(1.15,1.15,1.45),m["stone"],0.07)
    mansard("Watch tower roof", (0,0,7.65),2.55,2.55,1.1,m["slate"])
    cylinder("Police seal", (0,-2.99,4.55),0.52,0.13,blue,40)
    for x in (-0.3, 0.3):
        cube("Police seal detail", (x,-3.07,4.55),(0.08,0.05,0.38),m["trim"],0.015)
    cylinder("Blue beacon", (0,0,8.95),0.18,0.34,blue,24)
    export("paris-police")


def airport():
    clear(); m = palette()
    terminal_glass = material("Airport curtain glass", (0.07,0.22,0.29), metallic=0.18, roughness=0.1, transmission=0.3)
    concrete = material("Airport limestone concrete", (0.58,0.57,0.52), roughness=0.76)
    runway = material("Runway asphalt", (0.035,0.04,0.045), roughness=0.9)
    light = material("Runway light", (0.9,0.68,0.22), roughness=0.18, emission=(1.0,0.55,0.08))
    cube("Airport terminal", (0,0,1.65),(6.8,2.5,1.65),terminal_glass,0.12)
    cube("Terminal limestone frame", (0,-2.58,3.15),(7.0,0.16,0.18),concrete,0.03)
    for x in (-5.4,-3.6,-1.8,0,1.8,3.6,5.4):
        cube("Terminal mullion", (x,-2.62,1.72),(0.09,0.1,1.55),m["zinc"],0.015)
    cube("Departures portal", (0,-2.75,1.1),(1.15,0.12,1.08),m["door"],0.04)
    # Control tower.
    cylinder("Control tower shaft", (4.9,0.85,4.3),0.55,5.3,concrete,32)
    cylinder("Control room", (4.9,0.85,7.05),1.25,0.85,terminal_glass,40)
    cylinder("Control room roof", (4.9,0.85,7.53),1.4,0.16,m["zinc"],40)
    # Runway and illuminated centerline make the airport readable at map scale.
    cube("Runway", (-1.5,5.1,0.11),(8.2,1.25,0.11),runway,0.05)
    for x in range(-8, 6, 2):
        cube("Runway marking", (x,5.1,0.24),(0.48,0.12,0.035),m["trim"],0.01)
        for side in (-1,1):
            cylinder("Runway edge light", (x,5.1+side*1.12,0.29),0.055,0.12,light,12)
    # Two jetways.
    for x in (-3.5,2.2):
        cube("Passenger jetway", (x,-3.65,1.35),(0.42,1.05,0.38),m["zinc"],0.04)
        cube("Jetway glass", (x,-4.72,1.35),(0.62,0.18,0.55),terminal_glass,0.04)
    export("paris-airport")


def vehicles():
    clear(); m = palette()
    steel = material("Workshop steel", (0.11,0.16,0.18), metallic=0.55, roughness=0.4)
    workshop_glass = material("Workshop glass", (0.06,0.18,0.2), metallic=0.12, roughness=0.16, transmission=0.16)
    safety = material("Safety amber", (0.85,0.34,0.035), roughness=0.42)
    asphalt = material("Depot asphalt", (0.055,0.06,0.06), roughness=0.9)
    cube("Vehicle centre courtyard", (0,0,0.11),(6.7,4.0,0.11),asphalt,0.04)
    # Three individual maintenance halls with large doors.
    for index, x in enumerate((-4.35,0,4.35)):
        cube("Maintenance hall", (x,0.65,1.65),(1.85,3.05,1.65),m["stone"],0.09)
        mansard("Maintenance hall roof", (x,0.65,3.3),3.95,6.35,1.05,steel)
        cube("Vehicle bay door", (x,-2.45,1.3),(1.28,0.11,1.28),steel,0.04)
        for stripe in (-0.85,-0.42,0,0.42,0.85):
            cube("Bay door glass", (x+stripe,-2.58,1.45),(0.14,0.04,0.48),workshop_glass,0.012)
        cube("Safety lintel", (x,-2.62,2.72),(1.48,0.06,0.1),safety,0.015)
    # Administration tower and visible gear-like emblem.
    cube("Operations tower", (0,3.85,3.0),(1.35,1.05,3.0),m["stone"],0.08)
    mansard("Operations roof", (0,3.85,6.0),3.0,2.4,1.0,m["slate"])
    cylinder("Vehicle centre emblem", (0,-2.72,3.6),0.55,0.13,safety,32)
    cylinder("Emblem hub", (0,-2.8,3.6),0.2,0.15,steel,24)
    export("paris-vehicles")


def cafe():
    clear(); m = palette()
    awning = material("Cafe burgundy canvas", (0.32,0.018,0.025), roughness=0.78)
    brass = material("Cafe brass", (0.55,0.33,0.08), metallic=0.72, roughness=0.27)
    greenery = material("Terrace greenery", (0.055,0.22,0.095), roughness=0.86)
    cube("Paris corner cafe", (0,0,2.05),(3.65,2.35,2.05),m["stone"],0.1)
    mansard("Cafe mansard", (0,0,4.1),7.65,5.0,1.35,m["slate"])
    facade(7.3,-2.39,2,6,m["glass"],m["trim"],1.0,1.48,False)
    # Broad glazed cafe front and striped fabric awnings.
    for x in (-2.35,0,2.35):
        cube("Cafe storefront", (x,-2.5,1.05),(0.88,0.11,0.86),m["market_glass"],0.045)
        canopy = cube("Cafe awning", (x,-2.9,1.95),(1.05,0.52,0.11),awning,0.025)
        canopy.rotation_euler[0] = -0.18
        for stripe in (-0.7,-0.23,0.23,0.7):
            cube("Awning gold stripe", (x+stripe,-3.02,1.93),(0.08,0.52,0.025),m["trim"],0.008)
    cube("Cafe entrance", (0,-2.55,0.95),(0.58,0.09,0.92),m["door"],0.04)
    # Terrace tables, chairs and planters make the use unmistakable.
    for x in (-2.4,-0.8,0.8,2.4):
        cylinder("Round cafe table", (x,-4.25,0.55),0.42,0.08,brass,24)
        cylinder("Table pedestal", (x,-4.25,0.28),0.08,0.52,brass,16)
        for side in (-1,1):
            cube("Cafe chair", (x+side*0.62,-4.25,0.38),(0.22,0.24,0.38),m["door"],0.035)
    for x in (-3.45,3.45):
        cube("Terrace planter", (x,-3.8,0.34),(0.38,0.7,0.34),m["trim"],0.055)
        cylinder("Planter shrub", (x,-3.8,1.05),0.5,1.15,greenery,28)
    export("paris-cafe")


def restaurant():
    clear(); m = palette()
    velvet = material("Restaurant deep green", (0.018,0.13,0.08), roughness=0.52)
    brass = material("Restaurant brass", (0.58,0.37,0.1), metallic=0.78, roughness=0.23)
    cube("Grand restaurant facade", (0,0,2.55),(4.35,2.55,2.55),m["stone"],0.1)
    mansard("Restaurant mansard", (0,0,5.1),9.1,5.4,1.55,m["slate"])
    facade(8.7,-2.59,3,7,m["glass"],m["trim"],1.05,1.38)
    # Formal arched entry with a deep canopy.
    cube("Restaurant entrance", (0,-2.7,1.35),(0.78,0.1,1.35),velvet,0.06)
    arch("Restaurant entrance arch", (0,-2.82,2.45),0.92,0.5,m["trim"],(math.pi/2,0,0))
    cube("Restaurant canopy", (0,-3.25,3.0),(1.65,0.72,0.12),velvet,0.035)
    for x in (-1.45,1.45):
        cylinder("Canopy brass post", (x,-3.75,1.5),0.055,2.9,brass,16)
    # Orangerie dining wings.
    for side in (-1,1):
        cube("Dining conservatory", (side*5.1,0.3,1.55),(0.85,2.25,1.55),m["market_glass"],0.075)
        for z in (0.55,1.55,2.55):
            cube("Conservatory frame", (side*5.1,-2.0,z),(0.91,0.06,0.045),brass,0.01)
    cube("Restaurant name plaque", (0,-2.9,4.0),(1.55,0.07,0.3),brass,0.03)
    export("paris-restaurant")


def zoo():
    clear(); m = palette()
    green = material("Zoo botanical green", (0.03,0.19,0.085), metallic=0.1, roughness=0.55)
    botanical_glass = material("Botanical smoked glass", (0.025,0.12,0.095), metallic=0.16, roughness=0.22, transmission=0.12)
    leaf = material("Zoo living foliage", (0.06,0.31,0.11), roughness=0.92)
    water = material("Zoo water", (0.04,0.28,0.32), metallic=0.06, roughness=0.16, transmission=0.15)
    earth = material("Zoo habitat earth", (0.22,0.12,0.055), roughness=0.95)
    # Botanical gatehouse with two conservatory wings.
    cube("Zoo gatehouse", (0,0.55,2.3),(2.4,1.65,2.3),m["stone"],0.1)
    mansard("Zoo gatehouse roof", (0,0.55,4.6),5.15,3.65,1.25,m["slate"])
    cube("Zoo entrance", (0,-1.18,1.45),(0.88,0.12,1.45),green,0.07)
    arch("Zoo entrance arch", (0,-1.34,2.7),1.05,0.45,m["trim"],(math.pi/2,0,0))
    for side in (-1,1):
        cube("Botanical glasshouse", (side*4.2,0.65,1.65),(1.72,2.2,1.65),botanical_glass,0.09)
        for x in (-0.85,0,0.85):
            arch("Glasshouse iron rib", (side*4.2+x,0.65,3.0),1.7,1,green,(0,math.pi/2,0))
    # Habitat ring, pond and stylised mature trees.
    cylinder("Zoo habitat island", (0,5.2,0.18),5.6,0.36,earth,56)
    cylinder("Zoo habitat pond", (0,5.2,0.39),2.15,0.1,water,48)
    for angle in [i*math.pi/4 for i in range(8)]:
        x, y = math.cos(angle)*4.35, 5.2+math.sin(angle)*4.35
        cylinder("Zoo tree trunk", (x,y,1.15),0.18,2.1,m["door"],16)
        cylinder("Zoo tree crown", (x,y,2.65),0.72,1.45,leaf,28)
    # Twin elephant silhouettes at the gateway, readable at map distance.
    for side in (-1,1):
        cylinder("Elephant body", (side*1.55,-1.65,0.72),0.62,1.35,m["zinc"],28)
        cylinder("Elephant head", (side*1.55,-2.08,1.1),0.42,0.68,m["zinc"],28)
        trunk = cylinder("Elephant trunk", (side*1.55,-2.45,0.65),0.11,0.85,m["zinc"],16)
        trunk.rotation_euler[0] = math.pi/2
    export("paris-zoo")


def stadium():
    clear(); m = palette()
    steel = material("Stadium structural steel", (0.12,0.17,0.18), metallic=0.66, roughness=0.32)
    glass = material("Stadium smoked glass", (0.025,0.095,0.11), metallic=0.18, roughness=0.2, transmission=0.1)
    field = material("Stadium pitch", (0.025,0.22,0.07), roughness=0.94)
    track = material("Stadium running track", (0.24,0.035,0.025), roughness=0.9)
    # Elliptical arena bowl made from nested, scaled cylinders.
    outer = cylinder("Stadium limestone bowl", (0,0,1.35),7.2,2.7,m["stone"],64)
    outer.scale.y = 0.66
    rim = cylinder("Stadium steel rim", (0,0,2.75),7.35,0.24,steel,64)
    rim.scale.y = 0.66
    track_obj = cylinder("Athletics track", (0,0,2.93),5.85,0.11,track,64)
    track_obj.scale.y = 0.62
    pitch = cylinder("Football pitch", (0,0,3.02),4.75,0.12,field,64)
    pitch.scale.y = 0.52
    # Glass entrance pavilion and rhythmic exterior arches.
    cube("Stadium entrance pavilion", (0,-5.15,1.55),(2.2,0.72,1.55),glass,0.09)
    for x in (-5.4,-3.6,-1.8,0,1.8,3.6,5.4):
        arch("Stadium facade arch", (x,-4.82,1.6),0.72,0.45,m["trim"],(math.pi/2,0,0))
    # Four lighting towers.
    for x,y in ((-6,-3.7),(6,-3.7),(-6,3.7),(6,3.7)):
        cylinder("Floodlight mast", (x,y,4.4),0.1,6.5,steel,16)
        cube("Floodlight bank", (x,y,7.65),(0.72,0.18,0.42),glass,0.03)
    export("paris-stadium")


kind = sys.argv[-1] if "--" in sys.argv else "university"
if kind in ("university", "court", "library"):
    civic(kind)
elif kind == "market":
    market()
elif kind == "station":
    station()
elif kind == "hotel":
    hotel()
elif kind == "hospital":
    hospital()
elif kind == "police":
    police()
elif kind == "airport":
    airport()
elif kind == "vehicles":
    vehicles()
elif kind == "cafe":
    cafe()
elif kind == "restaurant":
    restaurant()
elif kind == "zoo":
    zoo()
elif kind == "stadium":
    stadium()
else:
    raise SystemExit("unknown building: " + kind)

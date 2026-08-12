import bpy
import math
import os

OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "maps", "models", "paris-chateau.glb"))

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)


def mat(name, color, metallic=0.0, roughness=0.55, emission=None):
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = 1.5
    return material


STONE = mat("French limestone", (0.58, 0.43, 0.27), roughness=0.74)
STONE_LIGHT = mat("Carved limestone", (0.78, 0.64, 0.44), roughness=0.68)
SLATE = mat("Natural slate", (0.035, 0.045, 0.052), roughness=0.43)
GLASS = mat("Warm windows", (0.09, 0.13, 0.15), metallic=0.08, roughness=0.22, emission=(0.95, 0.48, 0.12))
DOOR = mat("Oak doors", (0.10, 0.035, 0.018), roughness=0.62)
METAL = mat("Zinc details", (0.12, 0.14, 0.15), metallic=0.72, roughness=0.32)


def cube(name, location, scale, material, bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        modifier = obj.modifiers.new("Stone edge", "BEVEL")
        modifier.width = bevel
        modifier.segments = 3
    obj.data.materials.append(material)
    return obj


def cylinder(name, location, radius, depth, material, vertices=48):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    bevel = obj.modifiers.new("Masonry edge", "BEVEL")
    bevel.width = 0.05
    bevel.segments = 2
    return obj


def hipped_roof(name, location, width, depth, height):
    mesh = bpy.data.meshes.new(name + "Mesh")
    w, d = width / 2, depth / 2
    inset = min(width, depth) * 0.18
    verts = [(-w,-d,0),(w,-d,0),(w,d,0),(-w,d,0),(-w+inset,-d+inset,height),(w-inset,-d+inset,height),(w-inset,d-inset,height),(-w+inset,d-inset,height)]
    faces = [(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7),(4,5,6,7)]
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(SLATE)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    bevel = obj.modifiers.new("Slate seams", "BEVEL")
    bevel.width = 0.045
    bevel.segments = 2
    return obj


def conical_roof(name, location, radius, depth):
    bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=radius, radius2=0.12, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(SLATE)
    return obj


def window(x, y, z, sx=0.34, sz=0.58, facing="front"):
    if facing == "front":
        cube("French window", (x, y, z), (sx, 0.045, sz), GLASS, 0.035)
        cube("Stone sill", (x, y - 0.07, z - sz - 0.08), (sx + 0.1, 0.09, 0.06), STONE_LIGHT, 0.025)
        cube("Mullion", (x, y - 0.075, z), (0.035, 0.055, sz), STONE_LIGHT, 0.015)
    else:
        cube("French window", (x, y, z), (0.045, sx, sz), GLASS, 0.035)


def facade_windows(width, y, floors, columns, base_z=1.25):
    for floor in range(floors):
        for column in range(columns):
            x = -width * 0.38 + column * (width * 0.76 / (columns - 1))
            if floor == 0 and abs(x) < 0.75:
                continue
            window(x, y, base_z + floor * 1.45)


# Central corps de logis
cube("Central palace", (0, 0, 3.15), (5.8, 2.45, 3.15), STONE, 0.12)
hipped_roof("Central mansard", (0, 0, 6.3), 12.0, 5.2, 2.25)
facade_windows(11.6, -2.5, 4, 7, 1.2)
cube("Monumental gate", (0, -2.54, 1.55), (0.78, 0.12, 1.55), DOOR, 0.08)

# Palace wings and corner pavilions
for side in (-1, 1):
    x = side * 8.0
    cube("Grand wing", (x, 0.2, 2.55), (2.2, 2.2, 2.55), STONE, 0.11)
    hipped_roof("Wing mansard", (x, 0.2, 5.1), 4.7, 4.8, 1.75)
    for floor in range(3):
        for offset in (-1.1, 0, 1.1):
            window(x + offset, -2.04, 1.2 + floor * 1.35, 0.27, 0.5)
    # Colonnaded connector
    cube("Connector", (side * 5.9, 0.2, 1.8), (1.15, 1.65, 1.8), STONE_LIGHT, 0.08)
    for col_x in (side * 5.15, side * 5.75, side * 6.35):
        cylinder("Facade column", (col_x, -1.58, 1.65), 0.12, 3.1, STONE_LIGHT, 20)

# Four château towers
for x in (-4.4, 4.4):
    for y in (-2.25, 2.25):
        cylinder("Chateau tower", (x, y, 3.3), 1.25, 6.6, STONE, 64)
        for level in range(4):
            cylinder("Tower band", (x, y, 1.0 + level * 1.45), 1.32, 0.12, STONE_LIGHT, 64)
        conical_roof("Tower slate roof", (x, y, 7.3), 1.62, 2.8)
        for level in range(3):
            window(x, y - 1.27, 1.6 + level * 1.5, 0.26, 0.46)

# Dormers on the central mansard
for x in (-4.4, -2.2, 0, 2.2, 4.4):
    cube("Dormer", (x, -2.22, 6.9), (0.42, 0.32, 0.5), STONE_LIGHT, 0.05)
    window(x, -2.56, 6.88, 0.22, 0.3)
    hipped_roof("Dormer roof", (x, -2.22, 7.42), 1.05, 0.8, 0.52)

# Cornices, entrance columns and balustrade
for z in (0.65, 3.0, 5.8):
    cube("Grand cornice", (0, -2.58, z), (5.95, 0.15, 0.11), STONE_LIGHT, 0.025)
for x in (-1.15, 1.15):
    cylinder("Entrance column", (x, -2.75, 2.1), 0.18, 3.7, STONE_LIGHT, 24)
for x in [i * 0.38 - 2.47 for i in range(14)]:
    cylinder("Baluster", (x, -2.78, 4.78), 0.055, 0.68, STONE_LIGHT, 12)
cube("Balustrade rail", (0, -2.78, 5.16), (2.65, 0.09, 0.08), STONE_LIGHT, 0.02)

# Steps and paved terrace
for step in range(5):
    cube("Entrance step", (0, -3.1 - step * 0.32, 0.12 + step * 0.11), (1.8 + step * 0.32, 0.3, 0.11), STONE_LIGHT, 0.035)
cube("Palace terrace", (0, -1.2, 0.08), (11.2, 5.2, 0.08), STONE_LIGHT, 0.035)

# Finials
for x in (-4.4, 4.4):
    for y in (-2.25, 2.25):
        cylinder("Roof finial", (x, y, 8.9), 0.055, 1.0, METAL, 16)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.12, location=(x, y, 9.45))
        bpy.context.object.data.materials.append(METAL)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", export_apply=True, export_materials="EXPORT", export_yup=True)
print(f"EXPORTED {OUT}")

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Volume2, X } from "lucide-react";
import {speakFrench} from "@/lib/frenchSpeech";

type Animal = { fr: string; ar: string; slug: string };
type Category = { id: string; fr: string; ar: string; icon: string; animals: Animal[] };

const animalImageFiles:Record<string,string>={
 "lion":"020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg",
 "tiger":"Bengal_tiger_%28Panthera_tigris_tigris%29_female_3_crop.jpg",
 "leopard":"African_leopard_male_%28cropped%29.jpg",
 "cheetah":"Male_cheetah_facing_left_in_South_Africa.jpg",
 "elephant":"African_Bush_Elephant.jpg",
 "giraffe":"Giraffe_Mikumi_National_Park.jpg",
 "zebra":"Plains_Zebra_Equus_quagga_cropped.jpg",
 "rhinoceros":"081_White_rhinoceros_%28male%29_in_the_Kalahari_Desert_of_Namibia_Photo_by_Giles_Laurent.jpg",
 "hippopotamus":"Portrait_Hippopotamus_in_the_water.jpg",
 "camel":"07._Camel_Profile%2C_near_Silverton%2C_NSW%2C_07.07.2007.jpg",
 "gorilla":"Gorille_des_plaines_de_l%27ouest_%C3%A0_l%27Espace_Zoologique.jpg",
 "chimpanzee":"015_Chimpanzee_at_Kibale_forest_National_Park_Photo_by_Giles_Laurent.jpg",
 "brown-bear":"2010-kodiak-bear-1.jpg",
 "polar-bear":"Polar_Bear_-_Alaska_%28cropped%29.jpg",
 "giant-panda":"Grosser_Panda.JPG",
 "wolf":"Eurasian_wolf_2.jpg",
 "fox":"Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog_%28cropped%29.jpg",
 "kangaroo":"Forester_kangaroo_%28Macropus_giganteus_tasmaniensis%29_juvenile_hopping_Esk_Valley.jpg",
 "eagle":"Eagles_together.jpg",
 "falcon":"Eurasian_hobby_%28Falco_subbuteo%29_by_Shantanu_Kuveskar.jpg",
 "owl":"Bubo_bubo_sibiricus_-_01.JPG",
 "parrot":"Rainbow_lorikeet_%28Trichoglossus_moluccanus_moluccanus%29_Sydney.jpg",
 "peacock":"Peacock_Plumage.jpg",
 "flamingo":"010_Greater_flamingos_male_and_female_in_the_Camargue_during_mating_season_Photo_by_Giles_Laurent.jpg",
 "ostrich":"Struthio_camelus_-_Etosha_2014_%283%29.jpg",
 "pelican":"Pelikan_Walvis_Bay.jpg",
 "swan":"Mute_Swan_Emsworth2.JPG",
 "penguin":"South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg",
 "stork":"White_stork_%28Ciconia_ciconia%29_Bia%C5%82owieza.jpg",
 "toucan":"Toucans_%28Ramphastidae%29.jpg",
 "crocodile":"Nile_crocodile_head.jpg",
 "alligator":"Chinese%2Bamerican_alligators.png",
 "cobra":"Indiancobra.jpg",
 "python-snake":"Python_molurus_molurus_2.jpg",
 "monitor-lizard":"202306_Varanus_komodoensis.jpg",
 "iguana":"Green_Iguana_In_Florida.jpg",
 "chameleon":"Panther_Chameleon_738367_%28cropped%29.jpg",
 "tortoise":"A._gigantea_Aldabra_Giant_Tortoise.jpg",
 "sea-turtle":"Chelonia_mydas_is_going_for_the_air_edit.jpg",
 "gecko":"Phelsuma_l._laticauda.jpg",
 "dolphin":"Tursiops_truncatus_01-cropped.jpg",
 "blue-whale":"Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg",
 "orca":"Killerwhales_jumping.jpg",
 "great-white-shark":"White_shark.jpg",
 "manta-ray":"Manta_birostris-Thailand4.jpg",
 "seal":"Seehund.jpg",
 "walrus":"Walrus_in_the_Russian_Arctic_National_Park%2C_Novaya_Zemlya_2015-2.jpg",
 "octopus":"Octopus2.jpg",
 "jellyfish":"Jelly_cc11.jpg",
 "seahorse":"Hippocampus_hippocampus_%28on_Ascophyllum_nodosum%29.jpg",
 "cow":"Cow_%28Fleckvieh_breed%29_Oeschinensee_Slaunger_2009-07-07.jpg",
 "horse":"Nokota_Horses_cropped.jpg",
 "sheep":"Flock_of_sheep.jpg",
 "goat":"Hausziege_04.jpg",
 "donkey":"Donkey_in_Clovelly%2C_North_Devon%2C_England.jpg",
 "pig":"Pig_farm_Vampula_1.jpg",
 "rabbit":"Oryctolagus_cuniculus_Rcdo.jpg",
 "chicken":"Male_and_female_chicken_sitting_together.jpg",
 "duck":"Bucephala-albeola-010.jpg",
 "turkey":"Male_north_american_turkey_supersaturated.jpg",
 "butterfly":"Fesoj_-_Papilio_machaon_%28by%29.jpg",
 "bee":"Apis_mellifera_Western_honey_bee.jpg",
 "ant":"Red_Ant_-_March_2025.jpg",
 "ladybug":"Coccinella-septempunctata-15-fws.jpg",
 "dragonfly":"Red_grasshawk_%28Neurothemis_fluctuans%29_male_Phuket_2.jpg",
 "beetle":"Scarabaeus.sacer.jpg",
 "grasshopper":"American_Bird_Grasshopper.jpg",
 "praying-mantis":"Mantis_%28European%29.jpg",
 "stick-insect":"Le_Caylar_fg01.JPG",
 "bumblebee":"Bombus_lapidarius_-_Melilotus_officinalis_-_Tallinn.jpg"
};

function animalImage(slug:string){
 return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${animalImageFiles[slug]}?width=900`;
}

const categories: Category[] = [
  { id:"mammals", fr:"Les mammifères", ar:"الثدييات", icon:"🦁", animals:[
    ["Le lion","الأسد","lion"],["Le tigre","النمر","tiger"],["Le léopard","الفهد المرقط","leopard"],["Le guépard","الفهد الصياد","cheetah"],["L'éléphant","الفيل","elephant"],["La girafe","الزرافة","giraffe"],["Le zèbre","الحمار الوحشي","zebra"],["Le rhinocéros","وحيد القرن","rhinoceros"],["L'hippopotame","فرس النهر","hippopotamus"],["Le chameau","الجمل","camel"],["Le gorille","الغوريلا","gorilla"],["Le chimpanzé","الشمبانزي","chimpanzee"],["L'ours brun","الدب البني","brown-bear"],["L'ours polaire","الدب القطبي","polar-bear"],["Le panda géant","الباندا العملاقة","giant-panda"],["Le loup","الذئب","wolf"],["Le renard","الثعلب","fox"],["Le kangourou","الكنغر","kangaroo"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))},
  { id:"birds", fr:"Les oiseaux", ar:"الطيور", icon:"🦅", animals:[
    ["L'aigle","النسر","eagle"],["Le faucon","الصقر","falcon"],["Le hibou","البومة","owl"],["Le perroquet","الببغاء","parrot"],["Le paon","الطاووس","peacock"],["Le flamant rose","طائر الفلامنجو","flamingo"],["L'autruche","النعامة","ostrich"],["Le pélican","البجع","pelican"],["Le cygne","البجعة","swan"],["Le pingouin","البطريق","penguin"],["La cigogne","اللقلق","stork"],["Le toucan","الطوقان","toucan"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))},
  { id:"reptiles", fr:"Les reptiles", ar:"الزواحف", icon:"🐍", animals:[
    ["Le crocodile","التمساح","crocodile"],["L'alligator","القاطور","alligator"],["Le cobra","الكوبرا","cobra"],["Le python","الأصلة","python-snake"],["Le varan","الورل","monitor-lizard"],["L'iguane","الإغوانا","iguana"],["Le caméléon","الحرباء","chameleon"],["La tortue terrestre","السلحفاة البرية","tortoise"],["La tortue marine","السلحفاة البحرية","sea-turtle"],["Le gecko","الوزغ","gecko"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))},
  { id:"marine", fr:"Les animaux marins", ar:"الحيوانات البحرية", icon:"🐬", animals:[
    ["Le dauphin","الدلفين","dolphin"],["La baleine bleue","الحوت الأزرق","blue-whale"],["L'orque","الحوت القاتل","orca"],["Le requin blanc","القرش الأبيض","great-white-shark"],["La raie manta","شيطان البحر","manta-ray"],["Le phoque","الفقمة","seal"],["Le morse","حصان البحر","walrus"],["La pieuvre","الأخطبوط","octopus"],["La méduse","قنديل البحر","jellyfish"],["L'hippocampe","فرس البحر","seahorse"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))},
  { id:"farm", fr:"Les animaux de la ferme", ar:"حيوانات المزرعة", icon:"🐄", animals:[
    ["La vache","البقرة","cow"],["Le cheval","الحصان","horse"],["Le mouton","الخروف","sheep"],["La chèvre","الماعز","goat"],["L'âne","الحمار","donkey"],["Le cochon","الخنزير","pig"],["Le lapin","الأرنب","rabbit"],["La poule","الدجاجة","chicken"],["Le canard","البطة","duck"],["La dinde","الديك الرومي","turkey"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))},
  { id:"insects", fr:"Les insectes", ar:"الحشرات", icon:"🦋", animals:[
    ["Le papillon","الفراشة","butterfly"],["L'abeille","النحلة","bee"],["La fourmi","النملة","ant"],["La coccinelle","الدعسوقة","ladybug"],["La libellule","اليعسوب","dragonfly"],["Le scarabée","الخنفساء","beetle"],["La sauterelle","الجندب","grasshopper"],["La mante religieuse","فرس النبي","praying-mantis"],["Le phasme","الحشرة العصوية","stick-insect"],["Le bourdon","النحلة الطنانة","bumblebee"]
  ].map(([fr,ar,slug])=>({fr,ar,slug}))}
];

function speak(text:string){void speakFrench(text,{rate:.86})}

export default function ZooPage(){
 const [active,setActive]=useState(categories[0]);
 const [query,setQuery]=useState("");
 const animals=useMemo(()=>active.animals.filter(a=>`${a.fr} ${a.ar}`.toLowerCase().includes(query.toLowerCase())),[active,query]);
 return <main className="zoo-world" dir="rtl">
  <header className="zoo-header"><Link href="/kingdom" className="zoo-back"><ArrowLeft/> واجهة القلعة</Link><strong>Le Château des Langues</strong><div className="zoo-avatar">🧑🏻‍🎓</div></header>
  <section className="zoo-hero"><img src="/image/zoo-hero.png" alt="حديقة حيوانات عالمية وجمل يمشي في وسطها"/><div className="zoo-hero-shade"/><div className="zoo-hero-copy"><span>Le Zoo</span><h1>حديقة الحيوانات</h1><p>اكتشف الحيوانات بالفرنسية داخل أقسام منظمة، مع صورة ونطق وترجمة لكل حيوان.</p></div></section>
  <nav className="zoo-categories" aria-label="أقسام الحيوانات">{categories.map(c=><button key={c.id} className={active.id===c.id?"active":""} onClick={()=>{setActive(c);setQuery("")}}><b>{c.icon}</b><span>{c.fr}<small>{c.ar}</small></span></button>)}</nav>
  <section className="zoo-content">
   <div className="zoo-title"><div><span>{active.fr}</span><h2>{active.ar}</h2><p>{active.animals.length} حيوانًا دون تكرار</p></div><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن حيوان..."/>{query&&<button onClick={()=>setQuery("")}><X/></button>}</label></div>
   <div className="animal-grid">{animals.map(a=><article key={a.slug} className="animal-card"><div className="animal-photo"><img loading="lazy" src={animalImage(a.slug)} alt={`${a.fr} - ${a.ar}`}/><button onClick={()=>speak(a.fr)} aria-label={`استمع إلى ${a.fr}`}><Volume2/></button></div><div><h3 dir="ltr">{a.fr}</h3><p>{a.ar}</p></div></article>)}</div>
  </section>
 </main>
}

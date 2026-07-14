import { worlds } from "@/data/worlds";
type World=(typeof worlds)[number];
export default function WorldCard({world}:{world:World}){return <article className="world-card"><div className="world-visual">{world.icon}</div><div className="world-meta"><span className="level">{world.level}</span><span>مفتوح</span></div><h3>{world.title}</h3><p>{world.fr}</p><div className="progress"><span style={{width:`${world.progress}%`}}/></div><div className="world-bottom"><strong>{world.progress}%</strong><button>ادخل العالم</button></div></article>}

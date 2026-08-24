import { notFound } from "next/navigation";
import GrammarLevelClient from "./GrammarLevelClient";

const levels=new Set(["a1","a2","b1","b2","c1","c2"]);
export default async function GrammarLevelPage({params}:{params:Promise<{level:string}>}){
 const {level}=await params;if(!levels.has(level))notFound();return <GrammarLevelClient level={level}/>;
}

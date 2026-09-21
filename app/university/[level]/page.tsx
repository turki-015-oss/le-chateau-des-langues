import UniversityPage from "../page";

export default async function UniversityLevelPage({params,searchParams}:{params:Promise<{level:string}>;searchParams:Promise<{phase?:string;focus?:string}>}){
 const {level}=await params;
 const {phase,focus}=await searchParams;
 const initialPhaseIndex=phase&&/^\d+$/.test(phase)?Number(phase):undefined;
 return <UniversityPage initialLevelId={level} initialPhaseIndex={initialPhaseIndex} initialFocusModuleId={focus} levelPage/>;
}
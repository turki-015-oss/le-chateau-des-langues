import UniversityPage from "../../page";

export default async function UniversityLessonPage({params,searchParams}:{params:Promise<{level:string;module:string}>;searchParams:Promise<{phase?:string}>}){
 const {level,module}=await params;
 const {phase}=await searchParams;
 const initialPhaseIndex=phase&&/^\d+$/.test(phase)?Number(phase):undefined;
 return <UniversityPage initialLevelId={level} initialModuleId={module} initialPhaseIndex={initialPhaseIndex} levelPage lessonPage/>;
}
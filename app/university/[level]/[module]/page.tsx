import UniversityPage from "../../page";

export default async function UniversityLessonPage({params}:{params:Promise<{level:string;module:string}>}){
 const {level,module}=await params;
 return <UniversityPage initialLevelId={level} initialModuleId={module} levelPage lessonPage/>;
}

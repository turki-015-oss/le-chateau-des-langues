import UniversityPage from "../page";

export default async function UniversityLevelPage({params}:{params:Promise<{level:string}>}){
 const {level}=await params;
 return <UniversityPage initialLevelId={level} levelPage/>;
}

import { auth } from "@/auth";
import Navbar from "@/components/homepage/navbar";
import { redirect } from "next/navigation";


export default  async function Home() { 
  const session=await auth(); 
  if(session){
    redirect("/dashboard"); 
  };
  return (
 <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8"> 
 <Navbar />
 </div>
  );
}

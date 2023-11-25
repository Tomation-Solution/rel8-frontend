import { useQuery } from "react-query"
import { useState} from 'react'
import { fundAProject } from "../../../api/fundAProject/fund-a-project-api"
import SeeAll from "../../../components/SeeAll"
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"
import FundAProjectCard from "../../../components/cards/FundAProjectCard"
import { Link, useParams } from "react-router-dom"
import { FundAProjectDataType } from "../../../types/myTypes"
import Button from "../../../components/button/Button"

const FundAProjectDetailPage = () => {

   const [isPopoverOpen, setPopoverOpen] = useState(false);

   const togglePopOver = ()=>{
    setPopoverOpen(!isPopoverOpen)
   }

  

  const {projectId} = useParams()
 

  const projectItems  = useQuery("fund-a-project-item",fundAProject);

  const projectItem = projectItems.data?.data.find((item:FundAProjectDataType) => item.id.toString() === projectId);
  const otherProjects = projectItems.data?.data.filter((item: FundAProjectDataType) => item.id.toString() !== projectId);

  console.log('dfs',otherProjects)
  return (
    <main>
    <div className="grid grid-cols-4 gap-x-[80px]">
      <div className="col-span-4 xl:col-span-3">
          <BreadCrumb title="Fund A Project" />
          <div className='flex flex-col my-3 h-fit' >

          <p className='font-semibold' > {projectItem?.heading}</p>
          {/* <p className='text-sm' >Debo's Fousndation</p> */}
          </div>
          <div>
            <img
              src={projectItem?.image}
              className="w-full object-contain"
              alt=""
            />
          </div>
          <div className="col-span-1 mt-6">
              <h3 className=" font-semibold my-2" >About The Project</h3>
              <p className="text-textColor font-light text-justify" >{projectItem?.about}</p>
          </div>
          <div>
          <div className="grid grid-cols-1 my-2 w-full lg:w-1/2">
            <div className="flex items-center divide-x-2 divide-primaryBlue" >
              <p className="text-primaryBlue pr-2 font-semibold">Target</p>
              <p className="text-primary-blue flex items-center pl-2  gap-2 line-clamp-1"> 
            {projectItem?.what_project_needs.map((item:string,index:number)=> <span key={index} >{item}</span> )}
            </p>
              {/* <p className="text-primaryBlue flex items-center pl-2  gap-2"><BsGift className='w-5 h-5 ' /> 150,000</p> */}
            </div>
            {/* <div className="text-textColor gap-2 flex items-center justify-end">
              Progress
              <ProgressBar
               
                percentCompleted={`${(400/ 1000) *100}%`}
              />
            </div> */}
          </div>
          </div>


            <Button onClick={togglePopOver} text='Donate' className="lg:w-[240px] py-[9px] rounded-md" />
         

           
            <div className="relative inline-block text-left">
      

      {isPopoverOpen && (
        <div className="origin-top-right bottom-[30px] bg-white border absolute right-0 mt-2  w-48 rounded-md shadow-lg  ring-1 ring-black ring-opacity-5">
          <div className="py-2  flex flex-col  w-48 p-2 gap-2">
            {/* <button
              onClick={togglePopOver}
              className="w-full text-left px-4 py-2 bg-primary-blue text-white rounded-md  hover:bg-gray-100"
            >
               Support in Cash
            </button> */}
            <Link
               to={`/support-in-cash/${projectId}`}
              onClick={togglePopOver}
              className="w-full rounded-md text-left px-4 py-2 text-primary-blue "
            >
              Support in Cash
            </Link>
            <Link
            to={`/support-in-kind/${projectId}`}
              onClick={togglePopOver}
              className="w-full rounded-md text-left px-4 py-2 text-primary-blue "
            >
              Support in Kind
            </Link>
            {/* <Link
            to='/'
              onClick={togglePopOver}
              className="w-full rounded-md text-left px-4 py-2 bg-white border border-primary-blue text-primary-blue "
            >
              Support in Kind
            </Link> */}
          </div>
        </div>
      )}
    </div>

      </div>
      <div className="hidden xl:inline col-span-1">
        <SeeAll title="Others" />
        <div  className="space-y-3" >

        {otherProjects?.data?.data?.map((projectItem:any,index:number)=>(
         
         <FundAProjectCard key={index} projectItem={projectItem} />
        ))}
        {otherProjects?.length <=0 && <h3 className="text-primary-blue text-xl font-medium" >No  Project Available</h3>}
       
      
        </div>
      </div>
    </div>

</main>
  )
}

export default FundAProjectDetailPage
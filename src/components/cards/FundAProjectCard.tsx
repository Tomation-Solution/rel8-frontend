import { BsGift } from "react-icons/bs";
// import ProgressBar from "../progress-bar/ProgressBar";
import { FundAProjectDataType } from "../../types/myTypes";
import { Link } from "react-router-dom";

interface Props {
   projectItem:FundAProjectDataType
   height?:string;
    // hidePostDetails?:boolean
  }


const FundAProjectCard = ( {projectItem,height
 
}: Props) => {
  return (
    <div
    
    className={`relative w-full border rounded-md  ${height ? height : 'h-[280px]'}  my-2`}
  >
    <img
      src={projectItem?.image}
      // className="w-full rounded-md"
      // className="z-[-1] absolute rounded-xl top-0 left-0 bottom-0 right-0 w-full h-full object-fill max-h-[inherit]"
      className="  z-[-1] absolute rounded-xl top-0 left-0 bottom-0 right-0 w-full max-w-full h-full object-cover max-h-[inherit]"
      alt="news-image"
    />

    <div className="w-full rounded-md  absolute bottom-0 flex items-center justify-between rounded-b-xl gap-3 z-[3] px-5 py-2 text-sm text-white bg-white">
      <div className="w-full ">
        
        <Link to={`/fund-a-project/${projectItem.id}`} className="line-clamp-2 font-semibold text-textColor">{projectItem?.heading}</Link>
        {/* <div className="grid grid-cols-2 my-2"> */}
        <div className="grid  my-2">
          <div className="flex items-center divide-x-2 divide-primaryBlue" >
            <p className="text-primary-blue pr-2">Target</p>
            <p className="text-primary-blue flex items-center pl-2  gap-2 line-clamp-1"><BsGift className='w-5 h-5 ' />  
            {projectItem?.what_project_needs.map((item,index)=> <span key={index} >{item}</span> )}
            </p>
          </div>
          {/* <div className="text-textColor gap-2 flex items-center justify-end">
            Progress */}
            {/* <ProgressBar
             
              percentCompleted={`${(donatedAmount / targetAmount) *100}%`}
            /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  </div>
  )
}

export default FundAProjectCard
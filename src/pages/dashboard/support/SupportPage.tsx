import { Link } from "react-router-dom"
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"


const SupportPage = () => {
  return (
    <main className="">
    <BreadCrumb title='Support' />
<Link to='/faq' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
   
    <span className="font-light text-base" >FAQ</span>
</Link>
{/* <Link to='/contact' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
    
    <span className="font-light text-base" >Contact</span>
</Link> */}
<Link to='/admin-support' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
    
    <span className="font-light text-base" >Admin Support</span>
</Link>
<Link to='/technical-support' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
    
    <span className="font-light text-base" >Technical Support</span>
</Link>



</main>
  )
}

export default SupportPage
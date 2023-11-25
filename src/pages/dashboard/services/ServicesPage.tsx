import BreadCrumb from '../../../components/breadcrumb/BreadCrumb'
import { BsEmojiSmile } from 'react-icons/bs'
import { Link } from 'react-router-dom'

const ServicesPage = () => {
  return (
    <main className="">
        <BreadCrumb title='Services' />
    <div className=" flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
        <BsEmojiSmile className='w-5 h-5 ' />
        <span className="font-light text-base" >Setup Election</span>
    </div>
    <Link to='/reissuance-of-certificate' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
        <BsEmojiSmile className='w-5 h-5 text-black' />
        <span className="font-light text-base" >Reissuance of Certificate</span>
    </Link>
    <Link to='/loss-of-certificate-page' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
        <BsEmojiSmile className='w-5 h-5 text-black' />
        <span className="font-light text-base" >Loss of certificate</span>
    </Link>
    <Link to='/change-of-name' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
        <BsEmojiSmile className='w-5 h-5 text-black' />
        <span className="font-light text-base" >Change of Name</span>
    </Link>
    <Link to='/merger-of-companies' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
        <BsEmojiSmile className='w-5 h-5 text-black' />
        <span className="font-light text-base" >Merger of Member Companies </span>
    </Link>
    <Link to='/deactivate-membership' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
        <BsEmojiSmile className='w-5 h-5 text-black' />
        <span className="font-light text-base" >Deactivation / Suspension of Membership</span>
    </Link>
    <div className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
        <BsEmojiSmile className='w-5 h-5 text-black' />
        <span className="font-light text-base" >Activation of deactivated/ suspended member</span>
    </div>
    <Link to='/product-manufacturing-update' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
        <BsEmojiSmile className='w-5 h-5 text-black' />
        <span className="font-light text-base" >Update on product(s) manufactured</span>
    </Link>
    <Link to='//factory-location-update' className="flex items-center   bg-neutral-3 px-3 py-4 w-full lg:w-3/4 rounded-md my-2 whitespace-nowrap gap-2">
        <BsEmojiSmile className='w-5 h-5 text-black' />
        <span className="font-light text-base" >Update on factory locations</span>
    </Link>
    
  </main>
  )
}

export default ServicesPage
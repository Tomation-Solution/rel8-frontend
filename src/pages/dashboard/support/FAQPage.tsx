import BreadCrumb from '../../../components/breadcrumb/BreadCrumb'
import Accordion from '../../../components/accordion/Accordion'
import Toast from '../../../components/toast/Toast'
import { useQuery } from 'react-query'
import { fetchAllFAQ } from '../../../api/faq/api-faq'
import CircleLoader from '../../../components/loaders/CircleLoader'

const FAQPage = () => {
    const { notifyUser } = Toast();
    const {  data, isError, isLoading } = useQuery("faq",fetchAllFAQ);

      if (isError){
        notifyUser("An error occured while trying to fetch faq's","error")
      }

    if (isLoading){
        return <CircleLoader />
    }

    console.log('sss',data)

  return (
    <main className="">
    <BreadCrumb title='FAQ' />
    <div className='w-full lg:w-3/4' >
        {data?.data?.length <=0 && <h3 className='font-medium text-primary-blue' >No FAQ's Available</h3> }
        {data?.data?.length >0 && data?.data?.map((_:any,index:any)=>(
            <Accordion key={index} />
        ))}

    
    </div>



</main>
  )
}

export default FAQPage
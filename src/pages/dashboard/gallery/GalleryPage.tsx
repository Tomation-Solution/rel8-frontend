import { useQuery } from "react-query";
import Toast from "../../../components/toast/Toast";
import { fetchAllGalleryData} from "../../../api/gallery/gallery-api";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import CircleLoader from "../../../components/loaders/CircleLoader";
import GalleryCard from "../../../components/cards/GalleryCard";
import SeeAll from "../../../components/SeeAll";
import QuickNav from "../../../components/navigation/QuickNav";
import EventGrid from "../../../components/grid/EventGrid";

const GalleryPage = () => {

    const { notifyUser } = Toast();
    const {   data, isError, isLoading } = useQuery("galleryData", fetchAllGalleryData);
    console.log(data.data)
   
  if (isLoading){
    return <CircleLoader />
  }

  if (isError){
    notifyUser("An error occured while trying to fetch galey items","error")
  }
    
  return (
    <main>
    <div className="grid grid-cols-4  gap-x-[50px]">
        <div className='col-span-3' >
        <BreadCrumb title={"Albums"} />

        <div className={`${isLoading && `place-items-center`} grid grid-cols-4 gap-2`}>
        {isLoading && <CircleLoader />}

        {data?.data?.data?.map((galleryItem:any,index:number)=>(
         <GalleryCard key={index}   galleryItem={galleryItem} />
       ))}
          
        </div>
        </div>
        <div className="hidden xl:inline col-span-1">
            <SeeAll title='Highlights' path='/' /> 
            <EventGrid heightOfCard={"h-[170px]"}  numberOfItemsToShow={2} />
            <QuickNav />
        </div>
    </div>
</main>
  )
}

export default GalleryPage
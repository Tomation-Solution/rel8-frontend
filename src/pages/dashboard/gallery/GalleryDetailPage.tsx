import { useParams } from "react-router-dom";
import { fetchGalleryItem } from "../../../api/gallery/gallery-api";
import { useQuery } from "react-query";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import SeeAll from "../../../components/SeeAll";
import GalleryGrid from "../../../components/grid/GalleryGrid";
import QuickNav from "../../../components/navigation/QuickNav";
// import EventsCard from "../../../components/cards/EventsCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import ImageModal from "../../../components/ImageModal";
import { useState } from "react";

const GalleryDetailPage = () => {

  const { galleryId } = useParams();
  const { notifyUser } = Toast();
  const [modalState, setModalState] = useState({
    isOpen: false,
    currentIndex: 0,
  });

  const id: string | null = galleryId || null;

  const { data, isLoading, isError } = useQuery(['galleryItem', galleryId], () => fetchGalleryItem(id),{
    enabled: !!id,
  });

  const openModal = (index: number) => {
    setModalState({ isOpen: true, currentIndex: index });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, currentIndex: 0 });
  };

  const nextImage = () => {
    setModalState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % data.imageUrl.length,
    }));
  };

  const prevImage = () => {
    setModalState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? data.imageUrl.length - 1 : prev.currentIndex - 1,
    }));
  };

    if (isLoading){
    return <CircleLoader />
  }

  if (isError){
    notifyUser("An error occured while trying to fetch galey items","error")
  }



  

  return (
    <main  className='grid grid-cols-4 space-x-[60px]'>
    <div className='col-span-4 xl:col-span-3 flex flex-col'  >
    <BreadCrumb title={data?.caption||''} />
    {/* <h3 className="font-medium mb-2 text-xl" >{data?.data.name}</h3> */}
    {/* <p className="font-light text-sm" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, repellat illum! Maxime dolor officia similique in rem ipsa temporibus ipsam. 
      Quasi voluptatibus minus veritatis quis dolores et reiciendis debitis alias.</p> */}
 

    <div className=" grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
        {isLoading && <CircleLoader />}
    {data?.imageUrl.map((image:any,index:number)=>(
    <div key={index} className="relative group cursor-pointer" onClick={() => openModal(index)}>
      <img
        src={image}
        alt={`Gallery image ${index + 1}`}
        className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
        <span className="text-white opacity-0 group-hover:opacity-100 text-lg">View</span>
      </div>
    </div>
   ))}
    </div>
    </div>
    <div className="col-span-1 xl:inline">
        <SeeAll title='Highlights' path='/gallery' />
        <div className='relative ' >
         <GalleryGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2} />
        </div>
        <QuickNav />
    </div>

    <ImageModal
      images={data?.imageUrl || []}
      currentIndex={modalState.currentIndex}
      isOpen={modalState.isOpen}
      onClose={closeModal}
      onNext={nextImage}
      onPrev={prevImage}
    />
</main>
 )
}

export default GalleryDetailPage
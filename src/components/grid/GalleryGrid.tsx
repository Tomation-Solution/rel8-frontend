import { useQuery } from "react-query";
import { fetchAllGalleryData } from "../../api/gallery/gallery-api";
import GalleryCard from "../cards/GalleryCard";
import CircleLoader from "../loaders/CircleLoader";
import Toast from "../../components/toast/Toast";
interface Props {
  numberOfItemsToShow?: number;
  heightOfCard?:string;
}

const GalleryGrid = ({ numberOfItemsToShow,heightOfCard }: Props) => {

  const { notifyUser } = Toast();
  
  const { data, isError, isLoading } = useQuery(
    "galleryData",
    fetchAllGalleryData,
    {
      retry: 2,
      retryDelay: 3000, 
    }

  );

  if (isError){
    notifyUser("An error occured while fetching gallery data",'error')
  }
  if (isLoading){
    return <CircleLoader />
  }

  return (
    <>
      {data?.data?.data
        ?.slice(0, numberOfItemsToShow)
        .map((galleryItem: any, index: number) => (
          <GalleryCard height={heightOfCard} key={index} galleryItem={galleryItem} />
        ))}
    </>
  );
};

export default GalleryGrid;

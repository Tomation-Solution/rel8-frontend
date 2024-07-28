import { useQuery } from "react-query";
// import { fetchAllGalleryData } from "../../api/gallery/gallery-api";
import GalleryCard from "../cards/GalleryCard";
import CircleLoader from "../loaders/CircleLoader";
import Toast from "../../components/toast/Toast";
import { fetchUserPublications } from "../../api/publications/publications-api";
// fetchUserPublications
interface Props {
  numberOfItemsToShow?: number;
  heightOfCard?:string;
}

const PublicationGrid = ({ numberOfItemsToShow,heightOfCard }: Props) => {

  const { notifyUser } = Toast();
  
  const {error, data, isError, isLoading } = useQuery(
    "galleryData",
    fetchUserPublications,

  );

  if (isError){
    notifyUser(JSON.stringify(error),'error')
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

export default PublicationGrid;

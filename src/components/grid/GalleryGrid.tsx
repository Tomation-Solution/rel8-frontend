import { useQuery } from "react-query";
import { fetchAllGalleryData } from "../../api/gallery/gallery-api";
import GalleryCard from "../cards/GalleryCard";
import CircleLoader from "../loaders/CircleLoader";
import Toast from "../../components/toast/Toast";

interface GalleryItem {
  id: string;
  // Add other gallery item properties here
  [key: string]: any;
}

interface GalleryResponse {
  data: GalleryItem[];
  // Add other response properties if needed
}

interface Props {
  numberOfItemsToShow?: number;
  heightOfCard?: string;
}

const GalleryGrid = ({ numberOfItemsToShow, heightOfCard }: Props) => {
  const { notifyUser } = Toast();

  const { data, isError, isLoading, error } = useQuery<GalleryResponse>(
    "galleryData",
    fetchAllGalleryData,
    {
      retry: 2,
      retryDelay: 3000,
      onError: (err: Error) => {
        notifyUser(
          `An error occurred while fetching gallery data: ${err.message}`,
          "error"
        );
      },
    }
  );

  console.log(data, "Data");

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Failed to load gallery data
      </div>
    );
  }

  return (
    <div className="xl/lg:px-0 md:px-10 px-5">
      {data?.data
        ?.slice(0, numberOfItemsToShow)
        .map((galleryItem: GalleryItem, index: number) => (
          <GalleryCard
            height={heightOfCard}
            key={galleryItem.id || index}
            galleryItem={galleryItem}
          />
        ))}
    </div>
  );
};

export default GalleryGrid;

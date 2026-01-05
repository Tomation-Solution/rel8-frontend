// import { useQuery } from "react-query";
// import { fetchAllGalleryData } from "../../api/gallery/gallery-api";
// import GalleryCard from "../cards/GalleryCard";
// import CircleLoader from "../loaders/CircleLoader";
// import Toast from "../../components/toast/Toast";
// interface Props {
//   numberOfItemsToShow?: number;
//   heightOfCard?:string;
// }

// const GalleryGrid = ({ numberOfItemsToShow,heightOfCard }: Props) => {

//   const { notifyUser } = Toast();
  
//   const { data, isError, isLoading } = useQuery(
//     "galleryData",
//     fetchAllGalleryData,
//     {
//       retry: 2,
//       retryDelay: 3000, 
//     }

//   );

//   if (isError){
//     notifyUser("An error occured while fetching gallery data",'error')
//   }
//   if (isLoading){
//     return <CircleLoader />
//   }

//   return (
//     <>
//       {data?.data?.data
//         ?.slice(0, numberOfItemsToShow)
//         .map((galleryItem: any, index: number) => (
//           <GalleryCard height={heightOfCard} key={index} galleryItem={galleryItem} />
//         ))}
//     </>
//   );
// };

// export default GalleryGrid;
import { useQuery, QueryFunctionContext } from "react-query";
import { fetchAllGalleryData } from "../../api/gallery/gallery-api";
import GalleryCard from "../cards/GalleryCard";
import CircleLoader from "../loaders/CircleLoader";
import Toast from "../../components/toast/Toast";
import { useEnvironmentContext } from "../../context/environmentContext";
import { filterContentByEnvironment } from "../../utils/contentFilter";
import { useMemo } from "react";

interface Props {
  numberOfItemsToShow?: number;
  heightOfCard?: string;
}

const GalleryGrid = ({ numberOfItemsToShow, heightOfCard }: Props) => {
  const { notifyUser } = Toast();
  const { selectedEnvironments } = useEnvironmentContext();

  const { data, isError, isLoading } = useQuery(
    ["galleryData", { page: 1 }],
    ({ queryKey }: QueryFunctionContext<[string, { page: number }]>) => {
      const [, { page }] = queryKey;
      return fetchAllGalleryData(page);
    },
    {
      retry: 2,
      retryDelay: 3000,
    }
  );

  // Filter gallery items based on selected environments
  const filteredGalleryData = useMemo(() => {
    const filtered = filterContentByEnvironment(data, selectedEnvironments);
    return filtered?.slice(0, numberOfItemsToShow);
  }, [data, selectedEnvironments, numberOfItemsToShow]);

  if (isError) {
    notifyUser("An error occurred while fetching gallery data", 'error');
  }

  if (isLoading) {
    return <CircleLoader />;
  }
  return (
    <div className=" xl/lg:px-0 md:px-10 px-5">
      {filteredGalleryData && filteredGalleryData.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">
          No gallery items available for the selected environment(s).
        </div>
      ) : (
        filteredGalleryData?.map((galleryItem: any, index: number) => (
          <GalleryCard height={heightOfCard} key={index} galleryItem={galleryItem} />
        ))
      )}
    </div>
  );
};

export default GalleryGrid;

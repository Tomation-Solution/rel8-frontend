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

const GalleryDetailPage = () => {
  const { galleryId } = useParams();
  const { notifyUser } = Toast();

  const id: string | null = galleryId || null;

  const { data, isLoading, isError } = useQuery(
    ["galleryItem", galleryId],
    () => fetchGalleryItem(id),
    {
      enabled: !!id,
    }
  );

  console.log(data, "Gallery Item Data");

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    notifyUser("An error occured while trying to fetch galey items", "error");
  }

  return (
    <main className="grid grid-cols-4 space-x-[60px]">
      <div className="col-span-4 xl:col-span-3 flex flex-col">
        <BreadCrumb title={data?.caption || ""} />
        {/* <h3 className="font-medium mb-2 text-xl" >{data?.data.name}</h3> */}
        {/* <p className="font-light text-sm" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, repellat illum! Maxime dolor officia similique in rem ipsa temporibus ipsam. 
      Quasi voluptatibus minus veritatis quis dolores et reiciendis debitis alias.</p> */}

        <div className=" grid grid-col-1 md:grid-cols-2 gap-y-3 gap-x-6">
          {isLoading && <CircleLoader />}
          {data?.imageUrl?.map((eventItem: any, index: number) => (
            //  <EventsCard key={index}   eventItem={eventItem} />
            <img
              src={eventItem}
              key={index}
              className="object-cover h-[15rem] w-full rounded-md overflow-hidden"
            />
          ))}
        </div>
      </div>
      <div className="col-span-1 hidden xl:inline">
        <SeeAll title="Highlights" path="/gallery" />
        <div className="relative ">
          <GalleryGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2} />
        </div>
        <QuickNav />
      </div>
    </main>
  );
};

export default GalleryDetailPage;

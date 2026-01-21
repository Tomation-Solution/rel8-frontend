import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import QuickNav from "../../../components/navigation/QuickNav";
import { useQuery } from "react-query";
import { fetchUserPublications } from "../../../api/publications/publications-api";
import { PublicationDataType } from "../../../types/myTypes";
import PublicationCard from "../../../components/cards/PublicationCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { useEnvironmentContext } from "../../../context/environmentContext";
import { filterContentByEnvironment } from "../../../utils/contentFilter";
import { useMemo } from "react";

const PublicationsPage = () => {
  const { notifyUser } = Toast();
  const { selectedEnvironments } = useEnvironmentContext();

  const {  data, isLoading, isError} = useQuery('publications', fetchUserPublications,{
    // enabled: false,
  });

  // Filter publications based on selected environments
  const filteredPublications = useMemo(() => {
    return filterContentByEnvironment(data, selectedEnvironments);
  }, [data, selectedEnvironments]);

  if (isLoading){
    return <CircleLoader/>
  }

  if (isError){
    return notifyUser("An error occured while fetching publication details","error")
  }
  
  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-7">
         {/* Publications column */}
        <div className="col-span-1 md:col-span-3 md:px-0 px-5">
          <BreadCrumb title={"Publications"} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPublications?.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No publications available for the selected environment(s).
              </div>
            ) : (
              filteredPublications?.map((publicationItem: any, index:number) => (
                <PublicationCard key={index} publicationItem={publicationItem} />
              ))
            )}
          </div>
        </div>
         {/* Events column */}
        <div className="col-span-1 md:col-span-1">
          <BreadCrumb title={"Events"} />
          <div className="grid space-y-3 md:px-0 px-10" >
            <EventGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2} /> 
            <QuickNav />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PublicationsPage;

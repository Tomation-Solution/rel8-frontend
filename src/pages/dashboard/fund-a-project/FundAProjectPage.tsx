import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import FundAProjectCard from "../../../components/cards/FundAProjectCard";
import EventGrid from "../../../components/grid/EventGrid";
import QuickNav from "../../../components/navigation/QuickNav";
import { useQuery } from "react-query";
import { fundAProject } from "../../../api/fundAProject/fund-a-project-api";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { FundAProjectDataType } from "../../../types/myTypes";

const FundAProjectPage = () => {
  const { notifyUser } = Toast();

  const { data, isLoading, isError } = useQuery("fund-a-project", fundAProject);

  if (isError) {
    notifyUser("An error occurred while fetching items", "error");
  }

  console.log('fund', data);

  return (
    <main className="grid grid-cols-1 md:grid-cols-4 gap-7 text-textColor px-5 md:px-5">
      <div className="col-span-1 md:col-span-3 md:px-0">
        <BreadCrumb title="Fund a Project" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading && <CircleLoader />}
          {data?.results?.map((projectItem: FundAProjectDataType, index: number) => (
            <FundAProjectCard key={index} projectItem={projectItem} />
          ))}
        </div>
      </div>
      <div className="col-span-1 md:col-span-1">
        <SeeAll title="Events" />
        <EventGrid heightOfCard="h-[170px]" numberOfItemsToShow={2} />
        <QuickNav />
      </div>
    </main>
  );
};

export default FundAProjectPage;

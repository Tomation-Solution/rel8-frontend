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
    <main className="grid grid-cols-1 lg:grid-cols-4 space-x-5 text-textColor">
      <div className="col-span-1 lg:col-span-3">
        <BreadCrumb title="Fund a Project" />
        <div className="grid grid-cols-2 gap-3">
          {isLoading && <CircleLoader />}
          {data?.results?.map((projectItem: FundAProjectDataType, index: number) => (
            <FundAProjectCard key={index} projectItem={projectItem} />
          ))}
        </div>
      </div>
      <div className="col-span-1 hidden lg:inline">
        <SeeAll title="Events" />
        <EventGrid numberOfItemsToShow={2} />
        <QuickNav />
      </div>
    </main>
  );
};

export default FundAProjectPage;

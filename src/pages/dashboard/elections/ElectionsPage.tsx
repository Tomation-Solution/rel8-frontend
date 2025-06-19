import { useQuery } from "react-query";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { fetchElections } from "../../../api/elections/api-elections";
import ElectionPositionCard from "../../../components/cards/ElectionPositionCard";
import { ElectionPositionDataType } from "../../../types/myTypes";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";

const ElectionsPage = () => {
  const { notifyUser } = Toast();

  const { data, isLoading, isError } = useQuery("elections", fetchElections, {
    // enabled: false,
  });
  console.log(data, "Elections Data");

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    notifyUser(
      "Sorry, an error occured when fetching election positions",
      "error"
    );
  }
  return (
    <main>
      <BreadCrumb title="Elections" />
      <p>Below are the available electable position in this organization</p>
      {/* Item */}
      {data?.map((election: any) =>
        election.positions.map((position: any, index: number) => (
          <ElectionPositionCard key={index} item={position} />
        ))
      )}

      {data?.length <= 0 && (
        <h3 className="text-primary-blue font-medium">
          No Elections Position Available
        </h3>
      )}
    </main>
  );
};

export default ElectionsPage;

import { useQuery } from "react-query";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { fetchAllExcos, fetchAllMembers } from "../../../api/members/api-members";
import { useState } from "react";
import { ExcoMemberDataType } from "../../../types/myTypes";
import ExcosMemberCard from "../../../components/cards/ExcosMemberCard";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";

const ExcosPage = () => {
  const { data, isLoading, isError } = useQuery("excos", fetchAllMembers);
  const [currentPage, setCurrentPage] = useState(1);
  const { notifyUser } = Toast();

  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.filter((m) => m.exco.isExco)?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data?.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    notifyUser("An error occured while trying to fetch galey items", "error");
  }

  return (
    <main className="">
      <BreadCrumb title={"Meet the Excos"} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 flex-1">
        {currentItems?.map((item: ExcoMemberDataType, index: number) => (
          <ExcosMemberCard key={index} item={item} />
        ))}
      </div>

      {currentItems?.length <= 0 && (
        <h3 className="text-org-primary-blue text-xl">No Excos Available</h3>
      )}

      {pageNumbers.length > 0 && (
        <ul className="flex space-x-2 items-center justify-center my-2">
          {pageNumbers?.map((number, index) => (
            <li key={index}>
              <button
                className={`${
                  currentPage === number
                    ? "bg-org-primary text-white"
                    : "bg-neutral-3"
                } px-3 py-2 rounded-sm focus:outline-none`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ExcosPage;

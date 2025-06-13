import { useQuery } from "react-query";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { fetchAllMembers } from "../../../api/members/api-members";
import { useState } from "react";
import { ExcoMemberDataType } from "../../../types/myTypes";
import ExcosMemberCard from "../../../components/cards/ExcosMemberCard";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";

const MembersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { notifyUser } = Toast();

  const { isLoading, isError, data } = useQuery("members", fetchAllMembers);

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    return notifyUser(
      "sorry, an error occured while fetching members",
      "error"
    );
  }

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data?.data?.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <main className="flex flex-col">
      <BreadCrumb title={"Members"} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 flex-1">
        {currentItems?.map((item: ExcoMemberDataType, index: number) => (
          <ExcosMemberCard key={index} item={item} />
        ))}
      </div>

      {currentItems?.length <= 0 && (
        <h3 className="text-primary-blue text-xl">No Members Available</h3>
      )}

      {pageNumbers.length > 0 && (
        <ul className="flex space-x-2 items-center justify-center my-2">
          {pageNumbers?.map((number, index) => (
            <li key={index}>
              <button
                className={`${
                  currentPage === number
                    ? "bg-primary-blue text-white"
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

export default MembersPage;

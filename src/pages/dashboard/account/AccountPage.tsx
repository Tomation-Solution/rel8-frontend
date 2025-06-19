import accountWallet from "../../../assets/icons/account-wallet.png";
import CompletedPaymentTable from "../../../components/tables/CompletedPaymentTable";
import { useState } from "react";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
// import { TableDataType } from "../types/myTypes"
import { useQuery } from "react-query";
import { fetchUserDues } from "../../../api/account/account-api";
import { TableDataType } from "../../../types/myTypes";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";
// @ts-ignore
import Table from "../../../components/Table/Table";
import useDynamicPaymentApi from "../../../api/payment";
import moment from "moment";

const AccountPage = () => {
  const [showCompleted, setShowCompleted] = useState(true);
  const { pay, loadingPay } = useDynamicPaymentApi();
  const showPendingTable = () => {
    setShowCompleted(false);
  };
  const showCompletedTable = () => {
    setShowCompleted(true);
  };

  console.log("hahahah--->", showCompleted);

  const { data, isError, isLoading } = useQuery("userDues", fetchUserDues);

  console.log(data, "Dues Data");

  const { notifyUser } = Toast();

  if (isLoading) {
    return <CircleLoader />;
  }

  const paidDues = data?.filter(
    (dues: TableDataType) => dues.is_paid === true && dues.is_overdue === false
  );
  const pendingDues = data?.filter(
    (dues: TableDataType) => dues.is_paid === false
  );

  const totalPendingAmount = data
    ?.filter((dues: TableDataType) => dues.is_paid === false)
    ?.reduce((total: number, dues: TableDataType) => {
      return total + parseFloat(dues.amount);
    }, 0);

  if (isError) {
    notifyUser("An error occured while fetching account details", "error");
  }

  const prop_columns = [
    {
      Header: "Due Name",
      accessor: "purpose",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Due Date",
      accessor: "dueDate",
      id: 44,
      Cell: ({ value }: any) => moment(value).format("MMM D, YYYY"),
    },
    {
      Header: "Update Subbmission",
      accessor: "a",
      Cell: (tableProps: any) => (
        <button
          className="text-white bg-primary-blue px-3 py-1 rounded-md my-2 min-w-[70px]"
          onClick={() => {
            pay({ forWhat: "dues", payment_id: tableProps.row.original.id });
          }}
        >
          Pay
        </button>
      ),
    },
  ];

  return (
    <main>
      <BreadCrumb title="My Account" />
      {loadingPay && <CircleLoader />}
      <div className="flex items-center gap-x-9">
        <div className="flex items-center">
          <img
            className="w-[100px] h-[100px] object-contain"
            src={accountWallet}
            alt=""
          />
          <div>
            <h3 className="text-3xl font-bold text-primary-blue">
              {totalPendingAmount}
            </h3>
            {/* <h3 className="text-3xl font-bold text-primaryBlue">{totalPendingAmount}</h3> */}
            <small>Total Outstanding fee</small>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={showCompletedTable}
            className={`${
              showCompleted
                ? "bg-primary-blue text-white p-2  border border-white  "
                : "bg-[#ccddea] text-black border p-2 border-primaryBlue h-[40px] rounded-md"
            } h-[40px] rounded-md`}
          >
            Completed Payment
          </button>
          <button
            onClick={showPendingTable}
            className={`${
              !showCompleted
                ? "bg-primary-blue text-white p-2  border border-white  "
                : "bg-[#ccddea] text-black border p-2 border-primaryBlue h-[40px] rounded-md"
            } h-[40px] rounded-md`}
          >
            Pending Payment
          </button>
        </div>
      </div>
      <div>
        {/* {showCompleted ? "" : <PendingPaymentTable tableData={pendingDues} />} */}
        {/* {!showCompleted && pendingDues && <PendingPaymentTable  isLoading={isLoading} tableData={pendingDues} /> } */}
        {!showCompleted && pendingDues && (
          <Table prop_columns={prop_columns} custom_data={data} />
        )}
        {showCompleted && paidDues && (
          <CompletedPaymentTable isLoading={isLoading} tableData={paidDues} />
        )}
      </div>
    </main>
  );
};

export default AccountPage;

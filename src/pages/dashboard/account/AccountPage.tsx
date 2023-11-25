
import accountWallet from "../../../assets/icons/account-wallet.png";
import CompletedPaymentTable from "../../../components/tables/CompletedPaymentTable";
import { useState } from "react";
import PendingPaymentTable from "../../../components/tables/PendingPaymentTable";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
// import { TableDataType } from "../types/myTypes"
import { useQuery } from "react-query";
import { fetchUserDues } from "../../../api/account/account-api";
import { TableDataType } from "../../../types/myTypes";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";

const AccountPage = () => {
    const [showCompleted, setShowCompleted] = useState(true);
    const showPendingTable = () =>{
      setShowCompleted(false)
    }
    const showCompletedTable = () =>{
      setShowCompleted(true)
    }

    console.log('hahahah--->',showCompleted)

    const { data, isError, isLoading } = useQuery("userDues", fetchUserDues);

    const { notifyUser } = Toast();

    if (isLoading){
      return <CircleLoader />
    }
    
    
    const paidDues = data?.data.filter((dues:TableDataType) => dues.is_paid === true && dues.is_overdue === false);
    const pendingDues = data?.data.filter((dues:TableDataType) => dues.is_paid === false);

    const totalPendingAmount = data?.data.filter((dues:TableDataType) => dues.is_paid === false)?.reduce((total: number, dues: TableDataType) => {
      return total + parseFloat(dues.amount);
    }, 0);
    
    if (isError){
      notifyUser("An error occured while fetching account details","error")
    }
    
   
  return (
    <main>
    <BreadCrumb title="My Account" />
    <div className="flex items-center gap-x-9">
      <div className="flex items-center">
        <img
          className="w-[100px] h-[100px] object-contain"
          src={accountWallet}
          alt=""
        />
        <div>
          <h3 className="text-3xl font-bold text-primary-blue">{totalPendingAmount}</h3>
          {/* <h3 className="text-3xl font-bold text-primaryBlue">{totalPendingAmount}</h3> */}
          <small>Total Outstanding fee</small>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={showCompletedTable} className={`${showCompleted ? "bg-primary-blue text-white p-2  border border-white  " : "bg-[#ccddea] text-black border p-2 border-primaryBlue h-[40px] rounded-md" } h-[40px] rounded-md`}>
          Completed Payment
        </button>
        <button onClick={showPendingTable} className={`${!showCompleted ? "bg-primary-blue text-white p-2  border border-white  " : "bg-[#ccddea] text-black border p-2 border-primaryBlue h-[40px] rounded-md" } h-[40px] rounded-md`}>
          Pending Payment
        </button>
      </div>
    </div>
    <div>
    {/* {showCompleted ? "" : <PendingPaymentTable tableData={pendingDues} />} */}
    {!showCompleted && pendingDues && <PendingPaymentTable  isLoading={isLoading} tableData={pendingDues} /> }
    {showCompleted && paidDues && <CompletedPaymentTable isLoading={isLoading} tableData={paidDues} /> }
    
   
    </div>
  </main>
  )
}

export default AccountPage
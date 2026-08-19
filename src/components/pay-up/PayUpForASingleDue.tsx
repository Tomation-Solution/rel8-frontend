import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import { declareDuePayment, startDuePayment, type PaymentCheckout } from "../../api/paystack-api";
import BankTransferPanel from "../payments/BankTransferPanel";
import { fetchOrganizationSettings } from "../../api/organization/organization-api";
import Toast from "../toast/Toast";

interface Props {
    due__Name:string,
    amount:string;
    dueId:number;
}


  

const PayUpForASingleDue = ({due__Name,amount,dueId}:Props) => {

    const { notifyUser } = Toast();

    // MP-3: this screen used to handle only the Paystack path and told the member to go
    // to the Dues page for a transfer. It now completes either flow in place.
    const [checkout, setCheckout] = useState<PaymentCheckout | null>(null);
    const [declaring, setDeclaring] = useState(false);
    const [declared, setDeclared] = useState(false);
    const [declareError, setDeclareError] = useState("");
    const {  handleSubmit } = useForm();

    // Fetch organization settings
    const { data: orgSettings } = useQuery("organizationSettings", fetchOrganizationSettings);

    const currencySymbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      NGN: '₦',
      CAD: 'C$',
      AUD: 'A$',
    };

    const currentCurrency = orgSettings?.settings?.currency || 'USD';
    const currencySymbol = currencySymbols[currentCurrency] || '$';

    // X-7: dues start at POST /api/dues/pay/:dueId and return a unified `checkout`.
    // This screen only handles the Paystack path; bank transfer needs the account
    // details + reference UI, which lives on the Dues page.
    const {mutate, isLoading} = useMutation(()=>startDuePayment(String(dueId)), {
        onSuccess: (data) => {
            const co = data?.checkout;

            if (co?.method === "paystack" && co.authorizationUrl) {
              window.location.href = co.authorizationUrl;
              return;
            }

            if (co?.method === "bank_transfer") {
              setCheckout(co);
              return;
            }

            notifyUser('No payment method is configured for this due. Please contact your organisation.','error');
        },
        onError: (error:any) => {
          notifyUser(error?.response?.data?.message || 'An error occurred while starting your payment','error');
        },
      });

    const handleDeclare = async ({ proof, note }: { proof?: File | null; note?: string }) => {
      setDeclaring(true);
      setDeclareError("");
      try {
        await declareDuePayment(String(dueId), { proof, note });
        setDeclared(true);
      } catch (err: any) {
        setDeclareError(err?.response?.data?.message || "Could not submit. Please try again.");
      } finally {
        setDeclaring(false);
      }
    };

      const onSubmit = () =>{
        mutate()
      } 
      

      

  if (checkout) {
    return (
      <div className="my-2 w-full">
        <p className="mb-2 text-sm font-medium text-gray-800">
          {due__Name} — {currencySymbol}
          {amount}
        </p>
        <BankTransferPanel
          checkout={checkout}
          onDeclare={handleDeclare}
          declaring={declaring}
          declared={declared}
          error={declareError}
          title="Transfer to the account below"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}  className="flex flex-wrap items-center justify-center my-1" >
      <label className="font-light" >
      {due__Name}
      </label>
      <br />

      <label className='font-medium ml-1' >
      {currencySymbol}{amount}
      </label>
      <br />

      <button className="ml-2 bg-org-primary text-white p-2 rounded-md disabled:opacity-60" type="submit" disabled={isLoading}>
        {isLoading ? "Please wait…" : "Pay"}
      </button>
    </form>
  )
}

export default PayUpForASingleDue
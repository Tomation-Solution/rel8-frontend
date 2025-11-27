import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { payDue } from "../../api/dues/api-dues";
import { fetchOrganizationSettings } from "../../api/organization/organization-api";
import Toast from "../toast/Toast";

interface Props {
    due__Name:string,
    amount:string;
    dueId:number;
}


  

const PayUpForASingleDue = ({due__Name,amount,dueId}:Props) => {

    const { notifyUser } = Toast();
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

    const {mutate} = useMutation(()=>payDue(dueId), {
        onSuccess: (data) => {
          // Redirect the user to the authentication URL
          // const authenticationUrl = data?.authentication_url;
          // if (authenticationUrl) {
          //   window.location.href = authenticationUrl;
          // }
          // console.log('paid for event on paystack o data',data?.data?.data?.authorization_url)
         
            const authorizationURL = data?.data?.data?.authorization_url
           
            if (authorizationURL) {
              window.location.href = authorizationURL;
            }
          
  
        },
        onError: (error:any) => {
          // Handle error, notify user, etc.
          // console.log(error.response.data)
          notifyUser(JSON.stringify(error?.response.data?.message?.error)||'An error occured while paying for the event','error');
        },
      });

      const onSubmit = () =>{
        mutate()
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

      {/* Add more form fields based on the structure of dataObject */}

      <button className="ml-2 bg-org-primary text-white p-2 rounded-md "  type="submit">Pay</button>
    </form>
  )
}

export default PayUpForASingleDue
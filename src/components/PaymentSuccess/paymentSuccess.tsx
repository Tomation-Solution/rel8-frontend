import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { postPaymentSuccess } from '../../api/support/api-support';
import { useMutation } from 'react-query';
import Toast from '../../components/toast/Toast';
import { FaCheckCircle } from 'react-icons/fa';
import Button from '../button/Button';
import CircleLoader from '../loaders/CircleLoader';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { notifyUser } = Toast();

    const projectId = searchParams.get('project_id') || 'defaultProjectId';
    const amount = parseFloat(searchParams.get('amount') || '0');
    const paystackKey = searchParams.get('trxref') || ''; 
    // const memberRemark = searchParams.get('remark');
    
    const memberRemark = "Your dynamic member remark";

    const { mutate, isLoading } = useMutation(postPaymentSuccess, {
        onSuccess: () => {
            notifyUser('Payment was successful!', 'success');
            navigate(`/fund-a-project/success`);
        },
        onError: (error: any) => {
            if (error.response && error.response.data) {
                if (error.response.data.paystack_key) {
                    notifyUser('This payment has already been processed.', 'error');
                } else {
                    // notifyUser(`${error.response.data.message}`, 'error');
                }
            } else {
                notifyUser('An unexpected error occurred. Please try again.', 'error');
            }
        },
    });

    useEffect(() => {
        if (paystackKey) {
            const dataToSend = {
                is_paid: true,
                project: projectId,
                amount,
                member_remark: memberRemark,
                paystack_key: paystackKey,
            };
            mutate(dataToSend);
        }
    }, [paystackKey, projectId, amount, memberRemark, mutate]);

    if (isLoading) {
        return <CircleLoader />;
      }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg w-full">
                <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Fund Project Success</h1>
                <p className="text-gray-600">
                    Your payment for project {" "} 
                    {/* <span className="font-semibold text-green-500">{projectId}</span> */}
                    was successful. Thank you for your support!
                </p>
                <Button text="Go to Homepage" onClick={() => navigate('/')} />
            </div>
            
            {/* {isLoading && <p>Processing payment...</p>} */}
        </div>
    );
};

export default PaymentSuccessPage;


// import { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { postPaymentSuccess } from '../../api/support/api-support';
// import Toast from '../../components/toast/Toast';

// const SupportSuccessPage = () => {
//     const navigate = useNavigate();
//     const { search } = useLocation();
//     const { notifyUser } = Toast();

//     const queryParams = new URLSearchParams(search);
//     const project_id = queryParams.get('project_id');
//     const amount = queryParams.get('amount');
//     const paystack_key = queryParams.get('reference');

//     useEffect(() => {
//         const postSuccessData = async () => {
//             try {
//                 const data = {
//                     is_paid: true,
//                     project: project_id,
//                     amount: parseFloat(amount || '0'),
//                     member_remark: "paid for project funding",
//                     paystack_key: paystack_key || '',
//                 };

//                 const response = await postPaymentSuccess(data);
//                 console.log(response.data);

//                 if (response.success) {
//                     notifyUser('Payment successful!', 'success');
//                     navigate(`/fund-a-project/thank-you/${project_id}`);
//                 } else {
//                     notifyUser('Something went wrong!', 'error');
//                 }
//             } catch (error) {
//                 // notifyUser('Payment failed, please try again.', 'error');
//                 // console.error('Error in postSuccessData:', error);
//             }
//         };

//         if (project_id && amount && paystack_key) {
//             postSuccessData();
//         } else {
//             notifyUser('Invalid payment details.', 'error');
//             navigate('/fund-project/error');
//         }
//     }, [project_id, amount, paystack_key, navigate, notifyUser]);

//     return (
//         <div>
//             <h2>Processing Your Payment...</h2>
//         </div>
//     );
// };

// export default SupportSuccessPage;

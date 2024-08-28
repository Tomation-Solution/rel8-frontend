import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import Toast from '../../components/toast/Toast';
import { FaCheckCircle } from 'react-icons/fa';
import Button from '../button/Button';
import { postEventPaymentSuccess } from '../../api/events/events-api';
import CircleLoader from '../loaders/CircleLoader';

const EventPaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { notifyUser } = Toast();
    const eventId = searchParams.get('project_id') || 'defaultProjectId';
    const amount = parseFloat(searchParams.get('amount') || '0');
    const paystackKey = searchParams.get('trxref') || ''; 

    const { mutate, isLoading } = useMutation(postEventPaymentSuccess, {
        onSuccess: () => {
            notifyUser('Payment was successful!', 'success');
            // navigate(`/fund-a-event/success`);
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
                event: eventId,
                amount,
                paystack_key: paystackKey,
            };
            mutate(dataToSend);
        }
    }, [paystackKey, eventId, amount, mutate]);

    if (isLoading) {
        return <CircleLoader />;
      }

return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg w-full">
            <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Fund Project Success</h1>
            <p className="text-gray-600">
                Your payment for event {" "} 
                {/* <span className="font-semibold text-green-500">{eventId}</span> */}
                was successful. Thank you for your support!
            </p>
            <Button text="Go to Homepage" onClick={() => navigate('/')} />
        </div>
        {/* {isLoading && <p>Processing payment...</p>} */}
    </div>
);
}

export default EventPaymentSuccess
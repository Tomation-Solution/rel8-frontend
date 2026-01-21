import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import Toast from '../../components/toast/Toast';
import { FaCheckCircle } from 'react-icons/fa';
import Button from '../button/Button';
import CircleLoader from '../loaders/CircleLoader';
import { postServicePaymentSuccess } from '../../api/serviceRequestApi';

const ServicePaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { notifyUser } = Toast();

    const serviceId = searchParams.get('serviceId') || '';
    const amount = parseFloat(searchParams.get('amount') || '0');
    const paystackKey = searchParams.get('trxref') || '';
    const addressParam = searchParams.get('address') || '';

    const { mutate, isLoading } = useMutation(postServicePaymentSuccess, {
        onSuccess: () => {
            notifyUser('Payment was successful! Your service request has been submitted.', 'success');
            navigate(`/service-requests/${serviceId}`);
        },
        onError: (error: any) => {
            if (error.response && error.response.data) {
                if (error.response.data.paystack_key) {
                    notifyUser('This payment has already been processed.', 'error');
                } else {
                    notifyUser(error.response.data.message || 'An error occurred', 'error');
                }
            } else {
                notifyUser('An unexpected error occurred. Please try again.', 'error');
            }
        },
    });

    useEffect(() => {
        if (paystackKey && serviceId && addressParam) {
            try {
                const deliveryAddress = JSON.parse(decodeURIComponent(addressParam));
                const dataToSend = {
                    serviceId,
                    amount,
                    paystack_key: paystackKey,
                    deliveryAddress,
                };
                mutate(dataToSend);
            } catch (error) {
                notifyUser('Invalid address data. Please try again.', 'error');
                navigate(`/service-requests/${serviceId}`);
            }
        }
    }, [paystackKey, serviceId, amount, addressParam, mutate, navigate]);

    if (isLoading) {
        return <CircleLoader />;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg w-full">
                <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                <p className="text-gray-600">
                    Your payment for the service was successful. Thank you for your request!
                </p>
                <Button 
                    text="View My Requests" 
                    onClick={() => navigate(`/service-requests/${serviceId}`)} 
                    className="mt-4"
                />
            </div>
        </div>
    );
};

export default ServicePaymentSuccess;
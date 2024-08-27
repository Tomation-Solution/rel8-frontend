import { useParams } from 'react-router-dom';
// import { useEffect } from 'react';
// import axios from 'axios';
// import Toast from '../../components/toast/Toast';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccessPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    // const { notifyUser } = Toast();

    // useEffect(() => {
    //     notifyUser('Payment was successful!', 'success');
    // }, [projectId, notifyUser]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg w-full">
                <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Fund Project Success</h1>
                <p className="text-gray-600">
                    Your payment for project <span className="font-semibold text-green-500">{projectId}</span> was successful. Thank you for your support!
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;

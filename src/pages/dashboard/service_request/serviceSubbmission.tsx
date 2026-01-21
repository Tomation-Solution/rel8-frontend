import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import Toast from "../../../components/toast/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceDetail, createServiceRequest, DeliveryAddress } from "../../../api/serviceRequestApi";
import CircleLoader from "../../../components/loaders/CircleLoader";
import InputWithLabel from "../../../components/form/InputWithLabel";
import Button from "../../../components/button/Button";
import useDynamicPaymentApi from "../../../api/payment";

const schema = yup.object({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    country: yup.string().required('Country is required'),
    state: yup.string().optional(),
    postalCode: yup.string().optional(),
});

type FormI = yup.InferType<typeof schema>;

const ServiceSubmission = () => {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();
    const { pay, loadingPay } = useDynamicPaymentApi();
    const { notifyUser } = Toast();
    const [paymentProof, setPaymentProof] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormI>({
        resolver: yupResolver(schema),
    });

    const { isLoading: loadingService, data: service } = useQuery(
        ['getServiceDetail', serviceId],
        () => getServiceDetail({ serviceId: typeof serviceId === 'string' ? serviceId : '-1' }),
        {
            'enabled': typeof serviceId === 'string' ? true : false,
            refetchOnWindowFocus: false,
        }
    );

    const { isLoading: submitting, mutate: submitRequest } = useMutation(createServiceRequest, {
        onSuccess: () => {
            notifyUser('Service request submitted successfully!', 'success');
            navigate(`/service-requests/${serviceId}`);
        },
        onError: (error: any) => {
            notifyUser(error.response?.data?.message || 'Failed to submit service request', 'error');
        },
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const onSubmit = (data: FormI) => {
        if (!service) return;

        // Ensure required fields are present
        const deliveryAddress: DeliveryAddress = {
            street: data.street || '',
            city: data.city || '',
            country: data.country || '',
            state: data.state,
            postalCode: data.postalCode,
        };

        // Handle based on payment type
        if (service.paymentType === 'payment_link') {
            // For payment link, redirect to external payment
            // Note: payment_id expects a number, but we're using string ID
            // We'll pass it as a string and let the backend handle it
            pay({
                payment_id: parseInt(service._id.slice(-8), 16) || Date.now(), // Generate a numeric ID from string
                forWhat: 'service',
                query_param: `?serviceId=${serviceId}&address=${encodeURIComponent(JSON.stringify(deliveryAddress))}`,
            });
        } else {
            // For bank transfer, submit request with payment proof
            if (!paymentProof) {
                notifyUser('Please upload payment proof', 'error');
                return;
            }
            submitRequest({
                serviceId: serviceId!,
                deliveryAddress: deliveryAddress,
                paymentProof: paymentProof,
            });
        }
    };

    // Handle payment success callback (this would be called after payment is completed)
    const handlePaymentSuccess = async (paymentData: any) => {
        const addressData = JSON.parse(decodeURIComponent(paymentData.address));
        
        const deliveryAddress: DeliveryAddress = {
            street: addressData.street || '',
            city: addressData.city || '',
            country: addressData.country || '',
            state: addressData.state,
            postalCode: addressData.postalCode,
        };
        
        submitRequest({
            serviceId: serviceId!,
            deliveryAddress: deliveryAddress,
        });
    };

    return (
        <div>
            {(loadingService || submitting) && <CircleLoader />}
            
            <div className="max-w-2xl">
                <div className="bg-white ">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Request {service?.name}
                    </h2>
                    
                    {service && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600">Service Description:</p>
                            <p className="text-gray-800 mb-2">{service.description}</p>
                            <p className="text-sm text-gray-600">Service Price:</p>
                            <p className="text-2xl font-bold text-org-primary">{formatPrice(service.price)}</p>
                        </div>
                    )}

                    {/* Payment Information */}
                    {service && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Payment Information:</p>
                            {service.paymentType === 'bank_transfer' ? (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Please transfer the payment to the following bank account:</p>
                                    <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{service.paymentDetails}</p>
                                    </div>
                                    <p className="text-sm text-gray-600">After making the transfer, please upload your payment proof below.</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">You will be redirected to the payment gateway to complete your payment.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Delivery Address
                        </h3>
                        
                        <div className="space-y-4">
                            <InputWithLabel
                                label="Street Address"
                                register={register('street')}
                            />

                            <InputWithLabel
                                label="City"
                                register={register('city')}
                            />

                            <InputWithLabel
                                label="State (Optional)"
                                register={register('state')}
                            />

                            <InputWithLabel
                                label="Country"
                                register={register('country')}
                            />

                            <InputWithLabel
                                label="Postal Code (Optional)"
                                register={register('postalCode')}
                            />
                        </div>

                        {/* Payment Proof Upload (for bank transfer) */}
                        {service?.paymentType === 'bank_transfer' && (
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Proof <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <input
                                        type="file"
                                        id="paymentProof"
                                        accept="image/*,.pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setPaymentProof(file);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="paymentProof"
                                        className="cursor-pointer"
                                    >
                                        {paymentProof ? (
                                            <div>
                                                <p className="text-sm text-gray-800 font-medium">{paymentProof.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {(paymentProof.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Click to upload payment proof
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Supports: Images, PDF (Max 5MB)
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <strong>Note:</strong> {service?.paymentType === 'bank_transfer'
                                    ? 'After uploading your payment proof, your service request will be submitted for review.'
                                    : 'You will be redirected to the payment gateway to complete your payment. After successful payment, your service request will be submitted automatically.'}
                            </p>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <Button
                                text="Cancel"
                                className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                                onClick={() => navigate(`/service-requests/${serviceId}`)}
                            />
                            <Button
                                text={service?.paymentType === 'bank_transfer'
                                    ? (submitting ? "Submitting Request..." : "Submit Request")
                                    : (loadingPay ? "Processing Payment..." : "Proceed to Payment")
                                }
                                className="flex-1"
                                isLoading={loadingPay || submitting}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ServiceSubmission;
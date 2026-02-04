import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import Toast from "../../../components/toast/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceDetail, createServiceRequest, DeliveryAddress, uploadServiceRequestPaymentProof } from "../../../api/serviceRequestApi";
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
    const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

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

    // Create a pending request (used for payment_link flow so user can upload proof later)
    const { isLoading: creatingRequest, mutateAsync: createRequestAsync } = useMutation(createServiceRequest, {
        onSuccess: (created) => {
            setCreatedRequestId(created?._id || null);
            notifyUser('Request created. Proceed to payment, then upload proof on this page.', 'success');
        },
        onError: (error: any) => {
            notifyUser(error.response?.data?.message || 'Failed to create service request', 'error');
        },
    });

    // Bank transfer submission: create request with proof (required)
    const { isLoading: submittingBankTransfer, mutate: submitBankTransfer } = useMutation(createServiceRequest, {
        onSuccess: () => {
            notifyUser('Service request submitted successfully!', 'success');
            navigate(`/service-requests/${serviceId}`);
        },
        onError: (error: any) => {
            notifyUser(error.response?.data?.message || 'Failed to submit service request', 'error');
        },
    });

    const { isLoading: uploadingProof, mutate: uploadProof } = useMutation(uploadServiceRequestPaymentProof, {
        onSuccess: () => {
            notifyUser('Payment proof uploaded. An admin will verify it shortly.', 'success');
            navigate(`/service-requests/${serviceId}`);
        },
        onError: (error: any) => {
            notifyUser(error.response?.data?.message || 'Failed to upload payment proof', 'error');
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

        // For bank transfer: submit request WITH payment proof (required)
        if (service.paymentType !== 'payment_link') {
            if (!paymentProof) {
                notifyUser('Please upload payment proof', 'error');
                return;
            }
            submitBankTransfer({
                serviceId: serviceId!,
                deliveryAddress: deliveryAddress,
                paymentProof: paymentProof,
            });
        }
    };

    const handleSubmitRequest = async (data: FormI) => {
        if (!service) return;

        const deliveryAddress: DeliveryAddress = {
            street: data.street || '',
            city: data.city || '',
            country: data.country || '',
            state: data.state,
            postalCode: data.postalCode,
        };

        // Create a pending request first (so we can attach payment proof later)
        if (!createdRequestId) {
            try {
                const created = await createRequestAsync({
                    serviceId: serviceId!,
                    deliveryAddress,
                });
                setCreatedRequestId(created._id);
            } catch (e) {
                return;
            }
        }

        // If we have payment proof, upload it
        if (paymentProof && createdRequestId) {
            uploadProof({ requestId: createdRequestId, paymentProof: paymentProof });
        }

        // Open payment gateway in a new tab for payment_link type
        if (service.paymentType === 'payment_link') {
            pay({
                payment_id: parseInt(service._id.slice(-8), 16) || Date.now(),
                forWhat: 'service',
                query_param: `?serviceId=${serviceId}&address=${encodeURIComponent(JSON.stringify(deliveryAddress))}`,
                openInNewTab: true,
            });
        }
    };

    // Note: payment-success handling is done via the dedicated success page flow.

    return (
        <div>
            {(loadingService || creatingRequest || submittingBankTransfer || uploadingProof) && <CircleLoader />}
            
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

                        {/* Payment Proof Upload */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Proof <span className="text-red-500">*</span>
                            </label>
                            <div className={`border-2 border-dashed ${paymentProof ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-lg p-6`}>
                                <input
                                    type="file"
                                    id="paymentProof"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setPaymentProof(file);
                                            // If request is already created, upload proof immediately
                                            if (createdRequestId) {
                                                uploadProof({ requestId: createdRequestId, paymentProof: file });
                                            }
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="paymentProof"
                                    className="cursor-pointer flex flex-col items-center justify-center"
                                >
                                    {paymentProof ? (
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <p className="text-sm text-gray-800 font-medium mt-2">{paymentProof.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(paymentProof.size / 1024).toFixed(2)} KB
                                            </p>
                                            <p className="text-xs text-green-600 mt-2 font-medium">
                                                {uploadingProof ? 'Uploading...' : 'Click to change file'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="text-sm text-gray-600 mt-2">
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


                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <strong>Note:</strong> {service?.paymentType === 'bank_transfer'
                                    ? 'After uploading your payment proof, your service request will be submitted for review.'
                                    : 'Proceed to payment in a new tab, then upload proof of payment here so an admin can verify it.'}
                            </p>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <Button
                                text="Cancel"
                                className="flex-1 border border-gray-500 bg-transparent text-[#000] hover:bg-gray-500 hover:text-white"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/service-requests/${serviceId}`);
                                }}
                            />
                            <Button
                                text={
                                    loadingPay || creatingRequest || uploadingProof 
                                        ? "Submitting..." 
                                        : "Submit Request"
                                }
                                className="flex-1"
                                isLoading={loadingPay || creatingRequest || uploadingProof}
                                onClick={handleSubmit(handleSubmitRequest)}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ServiceSubmission;
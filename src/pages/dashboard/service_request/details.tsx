import { useNavigate, useParams } from "react-router-dom"
import { getServiceDetail, getMyServiceRequests } from "../../../api/serviceRequestApi"
import { useQuery } from "react-query"
import Button from "../../../components/button/Button"
import CircleLoader from "../../../components/loaders/CircleLoader"

const ServiceRequestDetail = () => {

    const { id: serviceId } = useParams();
    const navigate = useNavigate();

    const { isLoading: loadingService, data: service } = useQuery(
        ['getServiceDetail', serviceId],
        () => getServiceDetail({ serviceId: typeof serviceId === 'string' ? serviceId : '-1' }),
        {
            'enabled': typeof serviceId === 'string' ? true : false
        }
    );

    const { isLoading: loadingRequests, data: requests } = useQuery(
        ['getMyServiceRequests'],
        getMyServiceRequests,
        {
            'enabled': typeof serviceId === 'string' ? true : false
        }
    );

    // Filter requests for this specific service
    const serviceRequests = requests?.filter(req => req.serviceId._id === serviceId) || [];
    const hasPendingRequest = serviceRequests.some(req => req.requestStatus === 'pending');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status: string) => {
        const statusStyles: Record<string, string> = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'dispatched': 'bg-purple-100 text-purple-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getPaymentStatusBadge = (status: string) => {
        const statusStyles: Record<string, string> = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div>
            {(loadingService || loadingRequests) && <CircleLoader />}

            <div style={{ 'maxWidth': '900px' }}>
                <div>
                    <br /><br />
                    <h2 className="text-2xl font-bold text-gray-800">{service?.name}</h2>
                    <p className="text-gray-600 mt-2">{service?.description}</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Service Price:</p>
                        <p className="text-2xl font-bold text-org-primary">{service ? formatPrice(service.price) : ''}</p>
                    </div>

                    {/* Payment Information */}
                    {service && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Payment Information:</p>
                            {service.paymentType === 'bank_transfer' ? (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Please transfer the payment to the following bank account:</p>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{service.paymentDetails}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Click the button below to proceed with payment:</p>
                                    <a
                                        href={service.paymentDetails}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block bg-org-primary text-white px-4 py-2 rounded hover:bg-org-primary/90 transition-colors"
                                    >
                                        Proceed to Payment
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                    <br />
                    <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'flexWrap': 'wrap', 'gap': '10px' }}>
                        <h2 className="text-xl font-semibold text-gray-800">Your Previous Requests</h2>
                        <Button
                            className="w-[280px]"
                            onClick={() => {
                                navigate(`/service-requests-submission/${serviceId}`)
                            }}
                            text={`Request ${service?.name ?? ""}`}
                        />
                    </div>
                    <br /><br />

                    {serviceRequests.length === 0 ? (
                        <div className="py-10 text-gray-500">
                            <p>No previous requests for this service.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {serviceRequests.map((request) => (
                                <div key={request._id} className="border rounded-lg p-4 bg-white shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Request ID: {request._id.slice(-8)}</p>
                                            <p className="text-sm text-gray-500">Date: {new Date(request.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {getStatusBadge(request.requestStatus)}
                                            {getPaymentStatusBadge(request.paymentStatus)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-sm font-medium text-gray-700">Delivery Address:</p>
                                        <p className="text-sm text-gray-600">
                                            {request.deliveryAddress.street}, {request.deliveryAddress.city}, {request.deliveryAddress.country}
                                        </p>
                                    </div>

                                    {request.adminNotes && (
                                        <div className="mb-3 p-3 bg-yellow-50 rounded">
                                            <p className="text-sm font-medium text-gray-700">Admin Notes:</p>
                                            <p className="text-sm text-gray-600">{request.adminNotes}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        {request.paymentProof && (
                                            <a
                                                href={request.paymentProof}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View Payment Proof
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ServiceRequestDetail
import blueEllipse from '../../../assets/images/notification-blue-ellipse.png'
import pinkEllipse from '../../../assets/images/notification-ink-ellipse.png'
import BreadCrumb from '../../../components/breadcrumb/BreadCrumb'
import { getActiveServices } from '../../../api/serviceRequestApi'
import { useQuery } from 'react-query'
import CircleLoader from '../../../components/loaders/CircleLoader'
import Button from '../../../components/button/Button'
import { useNavigate } from "react-router-dom";

const ServiceRequest = () => {

    const { isLoading, data: services, error } = useQuery('getActiveServices', getActiveServices, {
        retry: 1,
        onError: (err) => {
            console.error('Error fetching services:', err);
        }
    })
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <main>
            <BreadCrumb title={"Service Request"} />
            {isLoading && <CircleLoader />}
            <br />
            {error && (
                <div className="py-10 text-center col-span-full md:text-[25px] text-red-500">
                    Error loading services. Please try again later.
                </div>
            )}
            {!isLoading && !error && (!services || services?.length === 0) && (
                <div className="py-10 text-center col-span-full md:text-[25px]">
                    No services available at the moment.
                </div>
            )}
            {
                services && services?.length > 0 && services?.map((service, index) => (
                    <div
                        key={index}
                        className='relative block md:flex items-center p-4 bg-neutral-3 rounded-md my-2 shadow-sm hover:shadow-md transition-shadow'>
                        <img src={pinkEllipse} className='absolute bottom-0 left-[30%] h-[30%] opacity-80' alt="" />
                        <img src={blueEllipse} className='absolute top-0 left-[50%] h-3/4 opacity-50' alt="" />
                        <div className='flex flex-col p-2 flex-1 z-10'>

                            <h3 className='text-lg font-semibold text-gray-800'>
                                {service.name}
                            </h3>

                            <p className='text-sm text-gray-600 mt-1'>{service.description}</p>
                            <p className='text-lg font-bold text-org-primary mt-2'>
                                {formatPrice(service.price)}
                            </p>
                        </div>
                        <Button
                            text='Request Service'
                            className='w-[140px] z-10'
                            onClick={() => {
                                navigate(`/service-requests/${service._id}`)
                            }}
                        />
                    </div>

                ))
            }

        </main>
    )
}

export default ServiceRequest
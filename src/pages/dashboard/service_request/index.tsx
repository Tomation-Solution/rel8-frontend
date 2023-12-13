import  { useState } from 'react'
import blueEllipse from  '../../../assets/images/notification-blue-ellipse.png'
import pinkEllipse from  '../../../assets/images/notification-ink-ellipse.png'
import BreadCrumb from '../../../components/breadcrumb/BreadCrumb'
import { getCustomServices } from '../../../api/serviceRequestApi'
import { useQuery } from 'react-query'
import CircleLoader from '../../../components/loaders/CircleLoader'
import Button from '../../../components/button/Button'
import { useNavigate } from "react-router-dom";

const ServiceRequest = ()=>{

    const {isLoading,data:services} = useQuery('getCustomServices',getCustomServices)
    const navigate = useNavigate();
    return (
        <main>
          <BreadCrumb title={"Service Request"} />
          {
              isLoading??
            <CircleLoader />
            }
          <br />
          {
            services?.map((d,index)=>(
                <div
                key={index} 
                className='relative block md:flex items-center p-2 bg-neutral-3 rounded-md my-1 ' >
                <img src={pinkEllipse} className='absolute bottom-0 left-[30%] h-[30%] opacity-80' alt="" />
                <img src={blueEllipse} className='absolute top-0 left-[50%] h-3/4 opacity-50' alt="" />
                <div className='flex flex-col p-2 flex-1' >

                <h3 className='text-sm font-semibold' >
                    {d.service_name}
                </h3>

                <p>{d.intro_text}</p>
                </div>
                <Button text='Request' className='w-[100px]'
                onClick={()=>{
                    navigate(`/service-requests/${d.id}`)
                }}/>
                </div>

                ))
          }

        </main>
    )
}

export default ServiceRequest
import  { useState } from 'react'
import blueEllipse from  '../../../assets/images/notification-blue-ellipse.png'
import pinkEllipse from  '../../../assets/images/notification-ink-ellipse.png'
import ZeroNotifications from '../../../assets/images/no-notification-available.png'
import BreadCrumb from '../../../components/breadcrumb/BreadCrumb'

const NotificationsPage = () => {
  const [notifications, ] = useState(["11"])
  return (
    <main>
        <BreadCrumb title='Notifications' />
        {notifications.length > 0 ? (

        <>
        <div className='flex flex-col my-2' >
            <small>Today</small>
            <div className='relative flex items-center p-2 bg-neutral-3 rounded-md my-1 ' >
              <img src={pinkEllipse} className='absolute bottom-0 left-[30%] h-[30%] opacity-80' alt="" />
              <img src={blueEllipse} className='absolute top-0 left-[50%] h-3/4 opacity-50' alt="" />
                <div className='flex flex-col p-2 flex-1' >
                    
                <h3 className='text-sm font-semibold' >You have an upcoming event</h3>
                <small className='text-xs text-neutral1' >The enclosed yearly conference is holding today at 5:00pm </small>
                
                </div>
             <small className='text-xs' >12:00pm</small>
            </div>
            <div className='relative flex items-center p-2 bg-neutral-3 rounded-md my-1 ' >
              <img src={pinkEllipse} className='absolute bottom-0 left-[30%] h-[30%] opacity-80' alt="" />
              <img src={blueEllipse} className='absolute top-0 left-[50%] h-3/4 opacity-50' alt="" />
                <div className='flex flex-col p-2 flex-1' >
                    
                <h3 className='text-sm font-semibold' >You have an upcoming event</h3>
                <small className='text-xs text-neutral-1' >The enclosed yearly conference is holding today at 5:00pm</small>
                
                </div>
             <small className='text-xs' >12:00pm</small>
            </div>
            <div className='relative flex items-center p-2 bg-neutral-3 rounded-md my-1 ' >
              <img src={pinkEllipse} className='absolute bottom-0 left-[30%] h-[30%] opacity-80' alt="" />
              <img src={blueEllipse} className='absolute top-0 left-[50%] h-3/4 opacity-50' alt="" />
                <div className='flex flex-col p-2 flex-1' >
                    
                <h3 className='text-sm font-semibold' >You have an upcoming event</h3>
                <small className='text-xs text-neutral-1' >The enclosed yearly conference is holding today at 5:00pm</small>
                
                </div>
             <small className='text-xs' >12:00pm</small>
            </div>
           
        </div>
        <div className='flex flex-col my-2' >
            <small>Yesterday</small>
            <div className='relative flex items-center p-2 bg-neutral-3 rounded-md my-1 ' >
              <img src={pinkEllipse} className='absolute bottom-0 left-[30%] h-[30%] opacity-80' alt="" />
              <img src={blueEllipse} className='absolute top-0 left-[50%] h-3/4 opacity-50' alt="" />
                <div className='flex flex-col p-2 flex-1' >
                    
                <h3 className='text-sm font-semibold' >You have an upcoming event</h3>
                <small className='text-xs text-neutral1' >The enclosed yearly conference is holding today at 5:00pm</small>
                
                </div>
             <small className='text-xs' >12:00pm</small>
            </div>
            <div className='relative flex items-center p-2 bg-neutral-3 rounded-md my-1 ' >
              <img src={pinkEllipse} className='absolute bottom-0 left-[30%] h-[30%] opacity-80' alt="" />
              <img src={blueEllipse} className='absolute top-0 left-[50%] h-3/4 opacity-50' alt="" />
                <div className='flex flex-col p-2 flex-1' >
                    
                <h3 className='text-sm font-semibold' >You have an upcoming event</h3>
                <small className='text-xs text-neutral-1' >The enclosed yearly conference is holding today at 5:00pm</small>
                
                </div>
             <small className='text-xs' >12:00pm</small>
            </div>
            <div className='relative flex items-center p-2 bg-neutral-3 rounded-md my-1 ' >
              <img src={pinkEllipse} className='absolute bottom-0 left-[30%] h-[30%] opacity-80' alt="" />
              <img src={blueEllipse} className='absolute top-0 left-[50%] h-3/4 opacity-50' alt="" />
                <div className='flex flex-col p-2 flex-1' >
                    
                <h3 className='text-sm font-semibold' >You have an upcoming event</h3>
                <small className='text-xs text-neutral-1' >The enclosed yearly conference is holding today at 5:00pm</small>
                
                </div>
             <small className='text-xs' >12:00pm</small>
            </div>
        </div>
        </>
        ):(
          <div className="my-2">
            <img src={ZeroNotifications} className=" object-contain max-w-[500px] " alt="" />
          </div>
        )}
    </main>
  )
}

export default NotificationsPage
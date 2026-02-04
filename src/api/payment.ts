import { useState} from 'react'
import Toast from '../components/toast/Toast'
import apiTenant from './baseApi'

type PayProp = {
    payment_id:number,
    forWhat:string,
    query_param?:string,
    openInNewTab?: boolean
}
const useDynamicPaymentApi =  ()=>{
   
    const [loading,setIsloading] = useState(false)
    
    const {notifyUser} = Toast()
    
    const pay = async ({payment_id,forWhat,query_param='', openInNewTab=false}:PayProp) => {
        notifyUser('Loading Gateway ','success')
        try{
            if(setIsloading){
                setIsloading(true) 
            }
             const resp = await apiTenant.post(`/dues/process_payment/${forWhat}/${payment_id}/${query_param}`)
            
             const url = resp.data.data.data.authorization_url
             if (openInNewTab) {
                window.open(url, '_blank', 'noopener,noreferrer');
             } else {
                window.location.href = url
             }

             return resp.data.data
        }
        
        catch(e:any){
            if(setIsloading){
                setIsloading(false)
            }
            try{
                notifyUser(e.response.data.message.error,'error')
            }catch(e){
                notifyUser('Please check your internet','error')
            }
           
        }
    }

    return {
        pay,
        'loadingPay':loading,

    }
}

export default useDynamicPaymentApi
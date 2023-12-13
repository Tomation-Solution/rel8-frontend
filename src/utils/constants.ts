
import BpmiLogo from '../assets/cover-images/bpmi-logo.jpg'
import { getSubdomain } from './extra_functions';


export const ENDPOINT_URL = "https://rel8.watchdoglogisticsng.com";
export const TENANT = getSubdomain()||'bpmi';
export const WSS = `ws://rel8.watchdoglogisticsng.com/ws/chat/${TENANT}/`;



export const  getTenantInfo = ()=>{
    const currentTenant = getSubdomain()|| TENANT
    const currentLogo:any = {
        'bpmi':BpmiLogo,
    }

    return {
        logo:currentLogo[currentTenant]
    }
}
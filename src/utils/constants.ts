
import BpmiLogo from '../assets/cover-images/bpmi-logo.jpg'
import anniLogo from '../assets/cover-images/aanilogo.png'
import nimnLogo from '../assets/cover-images/nimnlogoo.svg'
import bukaalogo from '../assets/cover-images/bukaalogo.png'

import { getSubdomain } from './extra_functions';


export const ENDPOINT_URL = "https://rel8.watchdoglogisticsng.com";
// export const ENDPOINT_URL = "http://127.0.0.1:8000";
export const TENANT = getSubdomain()||'aani';
export const WSS = `ws://rel8.watchdoglogisticsng.com/ws/chat/${TENANT}/`;
export const sitename='rel8.watchdoglogisticsng.com'


export const  getTenantInfo = ()=>{
    const currentTenant = TENANT
    const currentLogo:any = {
        'bpmi':BpmiLogo,
        'aani':anniLogo,
        'nimn':nimnLogo,
        'bukaa':bukaalogo,
    }

    return {
        logo:currentLogo[currentTenant]
    }
}

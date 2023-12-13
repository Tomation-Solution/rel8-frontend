import apiTenant from './baseApi';

export type ServiceType =  {
    "id": number,
    "service_name": string,
    "intro_text": string,
    "fields_subbission": {
        "fields": string[]
    },
    "file_subbission": {
        "fields": string[]
    },
    "is_paid": false,
    "break_down_of_payment":any ,
    "amount": string
}

export const getCustomServices = async ():Promise<ServiceType[]>=>{
    const resp  = await apiTenant.get(`/services_request/rel8-custom-services-member-handler/get_services/`)
    return resp.data.data
}
export const getServiceDetail = async ({service_id}:{service_id:string}):Promise<ServiceType>=>{
    const resp  = await apiTenant.get(`/services_request/rel8-custom-services-member-handler/${service_id}/get_service/`)
    return resp.data.data
}


type memberServiceSubmmisionProp = {
    "id": number,
    "status": string,
    "custom_service": number,
    "amount": string,
    "fields_subbission": {"id": number,"value": string,"name": string}[],
    "files": {"id": number,"value": string,"name": string}[]
}
export const getAllSubmissionOfAService = async ({service_id}:{service_id:string}):Promise<memberServiceSubmmisionProp[]>=>{
    const resp  = await apiTenant.get(`/services_request/rel8-custom-services-member-handler/?service_id=${service_id}`)
    return resp.data.data
}

export const memberServiceSubmission = async (form:any) =>{

    const resp  = await apiTenant.post(`/services_request/rel8-custom-services-member-handler/`,form)
    return resp.data

}

export type MemberServiceSubmissionType = {
    "id": number,
    "status": string,
    "custom_service": number,
    "amount": string,
    "fields_subbission": {
        "id": number,
        "value":string,
        "name": string
    }[],
    "files": {
        "id": number,
        "name": string,
        "value": string
    }[ ],
    "full_name": string,
    "service_name": string
}

export const getMemberServiceSubmission = async({member_submission_id}:{member_submission_id:string}):Promise<MemberServiceSubmissionType>=>{
    const resp  = await apiTenant.get(`/services_request/rel8-custom-services-member-handler/${member_submission_id}/`,)
    return resp.data.data

}
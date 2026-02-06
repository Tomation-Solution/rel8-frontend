import apiTenant from "../baseApi";



export type ExcoInfoType={
    id:number;
    member_id:number;
    name:string;
    about:string;
    can_upload_min:string;
    chapter_id:string;
}
export type MemberInfoType =  {
    id:number;
    name:string;
    value:string;
    member_id:number;
}
export type memberEducationType ={
    "member":number,
    "name_of_institution": string,
    "major": string,
    "degree": string,
    "language": string,
    "reading": string,
    "speaking":string,
    "date":string,
    "id"?: number,
    
}
export type memberEmploymentHistory = {
    "member": number,
    "postion_title": string,
    "employment_from": string,
    "employment_to": string,
    "employer_name_and_addresse":string,
    "id"?: number
}
export type MemberType =       {
    "id": number,
    "member_info": MemberInfoType[],
    "exco_info": ExcoInfoType[],
    "is_active": boolean,
    "email": string,
    "amount_owing": string,
    "is_exco": boolean,
    "is_financial": boolean,
    "user": number;
    'photo'?:string;
    'member_education':memberEducationType[],
    'member_employment_history':memberEmploymentHistory[],
    full_name?:string;
}

export const fetchAllMembers = async () =>{
    const response = await apiTenant.get(`/api/members/`);
    return response.data
}
export const fetchAllExcos = async () =>{
    const response = await apiTenant.get(`/api/excos`);
    // Backend returns { message, excos } so we extract excos array
    return response.data.excos || response.data || [];
}

export const fetchExcoById = async (excoId: string) => {
    const response = await apiTenant.get(`/api/excos/${excoId}`);
    return response.data.exco || response.data;
}


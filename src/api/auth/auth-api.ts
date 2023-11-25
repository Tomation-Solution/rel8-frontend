// import { RegistrationFormFields } from "../../pages/auth/RegistrationPage";
// import { VerifyMembershipForm } from "../../pages/auth/VerifyMember";
import { VerifyMembershipForm } from "../../pages/auth/VerifyMemberPage";
import { apiPublic } from "../baseApi";
import { VerifiedMembershipResponse } from "./auth-types";


export const verifyUserMembership =async (data:VerifyMembershipForm): Promise<VerifiedMembershipResponse> =>{
    const response = await apiPublic.post(`/auth/ManageMemberValidation/`,data);
    return response.data
}
export const createMember = async (data: any) =>{
    const response = await apiPublic.post(`/auth/ManageMemberValidation/create_member/`, data);
    return response.data
}

export const memberLogin = async (data: {email: string, password: string}) =>{
    const response = await apiPublic.post(`/auth/login/`, data);
    return response.data
}

export const requestPassword = async(data:{email:string})=>{
    const response = await apiPublic.post('/user/forgot-password/request_password_change/',data)
    return response.data
}

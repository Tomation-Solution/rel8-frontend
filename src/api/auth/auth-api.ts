// import { RegistrationFormFields } from "../../pages/auth/RegistrationPage";
// import { VerifyMembershipForm } from "../../pages/auth/VerifyMember";
import { VerifyMembershipForm } from "../../pages/auth/VerifyMemberPage";
import { apiPublic } from "../baseApi";
import { VerifiedMembershipResponse } from "./auth-types";


export const verifyUserMembership =async (data:VerifyMembershipForm): Promise<VerifiedMembershipResponse> =>{
    const response = await apiPublic.post(`/auth/ManageMemberValidation/`,data);
    return response.data
}

export const resetPassword =async (data: any) =>{
    const response = await apiPublic.post(`/members/set-password/`,data);
    return response.data
}



export const createMember = async (data: any) =>{
    const response = await apiPublic.post(`/auth/ManageMemberValidation/create_member/`, data);
    return response.data
}

export const memberLogin = async (data: {email: string, userType: string, password: string}) =>{
    const response = await apiPublic.post(`/members/login`, data);
    return response.data
}

export const requestPassword = async(data:{email:string})=>{
    const response = await apiPublic.post('/user/forgot-password/request_password_change/',data)
    return response.data
}

export const getAllChapters = async () =>{
    const response = await apiPublic.get(`/user/chapters`);
    // console.log(response.data)
    return response.data
}
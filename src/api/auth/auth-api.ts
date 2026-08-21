import { apiPublic } from "../baseApi";

/**
 * Removed: `verifyUserMembership` and `createMember`.
 *
 * They posted to `/auth/ManageMemberValidation/` and
 * `/auth/ManageMemberValidation/create_member/` — Django-era paths this backend does not
 * mount — and they implemented a self-registration flow that **does not exist**. Members
 * are created by an admin (or by an approved application); they receive an email, set a
 * password and log in. There is nothing to register for.
 *
 * The two screens that drove it, `VerifyMemberPage` and `RegistrationPage`, are gone with
 * them.
 */

export const resetPassword =async (data: {newPassword: string, token: string}) =>{
    const response = await apiPublic.post(`/members/reset-password/${data.token}`, {newPassword: data.newPassword});
    return response.data
}

export const setPassword =async (data: {password: string, token: string}) =>{
    const response = await apiPublic.post(`/members/set-password`,data);
    return response.data
}


export const memberLogin = async (data: {email: string, userType: string, password: string}) =>{
    const response = await apiPublic.post(`/members/login`, data);
    return response.data
}

export const requestPassword = async(data:{email:string})=>{
    const response = await apiPublic.post('/members/forgot-password',data)
    return response.data
}

export const getAllChapters = async () =>{
    const response = await apiPublic.get(`/user/chapters`);
    // console.log(response.data)
    return response.data
}
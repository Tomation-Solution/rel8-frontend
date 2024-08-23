// import FormError from '../../../components/form/FormError'
// import TextInputWithImage from '../../../components/form/TextInputWithImage'
// import { useForm } from 'react-hook-form';
// import BreadCrumb from '../../../components/breadcrumb/BreadCrumb';
// import Button from '../../../components/button/Button';
// import { useParams } from 'react-router-dom';
// import { supportInCash } from '../../../api/support/api-support';
// import { useMutation } from 'react-query';
// import Toast from '../../../components/toast/Toast'

// export type SupportInCashFields = {
//     amount: number;
//     remark: string;
//   };

// const SupportInCashPage = () => {
//     const { projectId } = useParams();
//     const { register,handleSubmit,  formState: { errors } } = useForm<SupportInCashFields>();
//     const { notifyUser } = Toast();

//     const {mutate,isLoading} = useMutation((data:any)=>supportInCash(projectId,data), {
//         onSuccess: (data) => {
        
//             console.log('support in cash  success data',data)
//             const authorizationURL = data?.data?.data?.authorization_url
            
//             if (authorizationURL) {
//               window.location.href = authorizationURL;
//             }
//         },
//         onError: (error: any) => {
//           notifyUser(`${error.response.data.message.error}`,'error');
//         },
//       });

//       const onSubmit = (data: SupportInCashFields) =>{
//         //   console.log('testing in cash page',data)
//         mutate(data)
//       } 

//   return (
//     <div>
//         <BreadCrumb title="Support in Cash" />
//         <form className="flex flex-col w-full max-w-md gap-y-4" onSubmit={handleSubmit(onSubmit)}  >
//             <div className='grid'>   
//                 {errors.amount?.type === 'required' && (<FormError message="Amount is required" />)}
//                 <small>Amount</small>
//                 <TextInputWithImage inputType='number' register={register} name="amount" placeHolder=""  />
//              </div>
//             <div className='grid' > 
//                 {errors.remark?.type === 'required' && (<FormError message="Remark is required" />)}
//                 <small>Remark</small>
//                 <textarea className='form-control'  {...register("remark")} ></textarea>
//              </div>
//              <Button isLoading={isLoading} text='Support' />
//             </form>
//     </div>
//   )
// }

// export default SupportInCashPage

import FormError from '../../../components/form/FormError'
import TextInputWithImage from '../../../components/form/TextInputWithImage'
import { useForm } from 'react-hook-form';
import BreadCrumb from '../../../components/breadcrumb/BreadCrumb';
import Button from '../../../components/button/Button';
import { supportInCash } from '../../../api/support/api-support';
import { useMutation } from 'react-query';
import Toast from '../../../components/toast/Toast'
import {  useNavigate, useParams } from 'react-router-dom';
import { getRel8LoginUserMemberId } from '../../../utils/extra_functions';

export type SupportInCashFields = {
    amount: number;
    remark: string;
};

const SupportInCashPage = () => {
    // const { projectId } = useParams();
    const projectId = useParams<{ projectId: string }>().projectId || 'defaultProjectId';
    const navigate = useNavigate(); // To handle navigation after success
    const { register, handleSubmit, formState: { errors } } = useForm<SupportInCashFields>();
    const { notifyUser } = Toast();

    // Assuming you have the memberId stored somewhere, for example, in context or props
    // const memberId = "some-member-id"; // Replace with actual memberId
    const memberId = getRel8LoginUserMemberId();
    // console.log(memberId)

    const { mutate, isLoading } = useMutation((data: any) => supportInCash(projectId, data, memberId), {
        onSuccess: (data) => {
            console.log('Support in cash success data', data);
            const authorizationURL = data?.data?.data?.authorization_url;

            if (authorizationURL) {
                window.location.href = authorizationURL;
            } else if (data?.data?.status) {
                // Navigate to success page if payment is successful
                // navigate('/success');
                navigate(`/fund-project/success/${projectId}`);
            }
        },
        onError: (error: any) => {
            notifyUser(`${error.response.data.message.error}`, 'error');
        },
    });

    const onSubmit = (formData: SupportInCashFields) => {
        const dataToSend = {
            amount: formData.amount,
            project_id: projectId,
            member_remark: formData.remark,
        };
        mutate(dataToSend);
    };

    return (
        <div>
            <BreadCrumb title="Support in Cash" />
            <form className="flex flex-col w-full max-w-md gap-y-4" onSubmit={handleSubmit(onSubmit)}  >
                <div className='grid'>
                    {errors.amount?.type === 'required' && (<FormError message="Amount is required" />)}
                    <small>Amount</small>
                    <TextInputWithImage inputType='number' register={register} name="amount" placeHolder="" />
                </div>
                <div className='grid'>
                    {errors.remark?.type === 'required' && (<FormError message="Remark is required" />)}
                    <small>Remark</small>
                    <textarea className='form-control'  {...register("remark")} ></textarea>
                </div>
                <Button isLoading={isLoading} text='Support' />
            </form>
        </div>
    )
}

export default SupportInCashPage;

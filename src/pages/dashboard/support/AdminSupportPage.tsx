import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import TextInputWithImage from "../../../components/form/TextInputWithImage";
import FormError from "../../../components/form/FormError";
import userIconImage from "../../../assets/icons/user.png";
import Button from "../../../components/button/Button";
import { useAdminSupport } from '../../../hooks/contactUsHook'; // Update the path accordingly
import messageIcon from '../../../assets/icons/message.png';
import Toast from "../../../components/toast/Toast";

export type AdminSupportFormFields = {
    name: string;
    division: string;
    message: string;
    email: string;
};

interface AdminSupportPayload {
    sender_name: string;
    sender_email: string;
    message: string;
}

interface AdminSupportResponse {
    message: string;
    // Add any other properties from the response if necessary
}

const AdminSupportPage = () => {
    const { notifyUser } = Toast();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AdminSupportFormFields>();
    const { mutate, isLoading, isError, error, isSuccess, data } = useAdminSupport();
    const [hasNotified, setHasNotified] = useState(false); // State to track notification

    const onSubmit = (formData: AdminSupportFormFields) => {
        const payload: AdminSupportPayload = {
            sender_name: formData.name,
            sender_email: formData.email,
            message: formData.message,
        };

        console.log("Payload being sent:", payload); // Debugging line
        mutate(payload as any); // Cast as any if needed to bypass type check.
        setHasNotified(false); // Reset notification status on new submission
    };

    useEffect(() => {
        if (isSuccess && data && (data as AdminSupportResponse).message && !hasNotified) {
            notifyUser((data as AdminSupportResponse).message, "success");
            reset(); // Clear the form after successful submission
            setHasNotified(true); // Set notification as shown
        }

        if (isError && !hasNotified) {
            notifyUser(`Something went wrong`, "error");
            setHasNotified(true); // Set notification as shown
        }
    }, [isSuccess, isError, error, data, notifyUser, reset, hasNotified]);

    return (
        <main>
            <div className="w-full lg:w-3/4">
                <BreadCrumb title="Contact Us" />

                <form className="flex flex-col w-full max-w-md gap-y-4 my-3" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        {errors.name?.type === 'required' && (<FormError message="Name is required" />)}
                        <TextInputWithImage register={register} name="name" placeHolder="Name" image={userIconImage} />
                    </div>

                    <div>
                        {errors.email?.type === 'required' && (<FormError message="Email is required" />)}
                        <TextInputWithImage inputType="email" register={register} name="email" placeHolder="Email" image={messageIcon} />
                    </div>

                    <div>
                        {errors.message?.type === 'required' && (<FormError message="Message is required" />)}
                        <textarea className="form-control p-2 rounded-md h-[200px]" placeholder="Message" {...register("message", { required: true })}></textarea>
                    </div>

                    <div className="grid">
                        <Button text='Submit' isLoading={isLoading} />
                    </div>
                </form>
            </div>
        </main>
    );
};

export default AdminSupportPage;

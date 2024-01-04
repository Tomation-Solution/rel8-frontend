import axios from "axios"
import {useEffect, useState} from "react"
import {ENDPOINT_URL,TENANT} from "../utils/constants";
import CircleLoader from "../components/loaders/CircleLoader";


function ActivateAccount() {
    const query = new URLSearchParams(window.location.search);

    const [status, setStatus] = useState<'error' | 'okay' | 'loading'>('loading');

    async function activate(uidb64: string, token: string) {
        return (await axios.get(`${ENDPOINT_URL}/tenant/${TENANT}/mailing/activate/${uidb64}/${token}`));
    }

    useEffect(() => {
        if (!query) return setStatus("error");

        setStatus('loading')

        const uidb64 = query.get('uidb64');
        const token = query.get("token");

        if (!uidb64 || !token || uidb64 === "" || token === "") return setStatus("error");

        activate(uidb64, token).then((res) => {
            setStatus("okay");
        }).catch(() => setStatus("error"));

    }, [])

    return (
        <div className='grid place-items-center h-screen w-full'>
            {status === "loading" && <CircleLoader/>}
            {status === "error" && (
                <h3 className='font-semibold text-error-main'>This link appears to be broken. Please try again with the original link or contact support!</h3>
            )}
            {status === "okay" && (
                <h3 className='font-semibold text-success-main'>Account activated successfully. Proceed to sign in to your account.</h3>
            )}
        </div>
    )
}

export default ActivateAccount
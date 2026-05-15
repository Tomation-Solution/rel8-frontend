import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyPaystackPayment } from "../api/paystack-api";

type VerifyState = "loading" | "success" | "failed";

const typeRedirectMap: Record<string, { label: string; path: string }> = {
  due: { label: "View My Dues", path: "/dues" },
  project: { label: "View Projects", path: "/fund-a-project" },
  service: { label: "View Service Requests", path: "/service-requests" },
};

const PaystackCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("");

  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  const type = searchParams.get("type") ?? "due";

  useEffect(() => {
    if (!reference) {
      setState("failed");
      setMessage("No payment reference found.");
      return;
    }

    verifyPaystackPayment(reference)
      .then(res => {
        if (res.message === "Payment verified" || res.status === "success") {
          setState("success");
          setMessage(res.message || "Payment verified successfully.");
        } else {
          setState("failed");
          setMessage(res.message || "Payment could not be verified.");
        }
      })
      .catch(err => {
        setState("failed");
        setMessage(err?.response?.data?.message || "An error occurred while verifying your payment.");
      });
  }, [reference]);

  const redirect = typeRedirectMap[type] ?? typeRedirectMap["due"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {state === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-org-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Verifying Payment…</h2>
            <p className="text-sm text-gray-500">Please wait while we confirm your payment.</p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            {reference && <p className="text-xs text-gray-400 mb-6">Reference: {reference}</p>}
            <Link to={redirect.path} className="inline-block bg-org-primary text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition">
              {redirect.label}
            </Link>
          </>
        )}

        {state === "failed" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <Link to={redirect.path} className="inline-block bg-org-primary text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition">
                {redirect.label}
              </Link>
              <Link to="/" className="text-sm text-gray-500 hover:underline">
                Go to Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaystackCallbackPage;

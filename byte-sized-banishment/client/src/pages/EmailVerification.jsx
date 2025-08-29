import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EmailVerification = () => {
  const { userId, token } = useParams();
  const [status, setStatus] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify/${userId}/${token}`
        );
        setStatus("success");
        toast.success("Email verified! Redirecting...");
        setTimeout(() => navigate("/verification-success"), 2000);
      } catch (err) {
        setStatus("error");
        toast.error("Verification failed or link expired.");
      }
    };
    if (userId && token) verify();
  }, [userId, token, navigate]);

  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-green-900">
        <div className="bg-gray-800 p-8 rounded-xl shadow-xl text-white text-center">
          <div className="animate-spin mx-auto w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mb-4"></div>
          <p>Verifying your email...</p>
        </div>
      </div>
    );
  }
  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-green-900">
        <div className="bg-gray-800 p-8 rounded-xl shadow-xl text-white text-center">
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-red-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl text-white text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-2">
          Verification Failed
        </h2>
        <p className="text-gray-300">This link is invalid or has expired.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;

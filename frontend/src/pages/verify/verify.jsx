import React, { useContext, useEffect } from "react";
import "./verify.css";
import { useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const res = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
        sessionId,
      });

      if (res.data.success) {
        navigate("/myOrders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (!orderId || !success) {
      navigate("/");
      return;
    }
    verifyPayment();
  }, [orderId, success]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;

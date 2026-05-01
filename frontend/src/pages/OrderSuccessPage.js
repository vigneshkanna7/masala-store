import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);

  // ─── Get order details passed from CheckoutPage ───────────
  const orderDetails = location.state || {};
  const isGuest = !localStorage.getItem("token");

  // ─── Auto redirect after 5 seconds ───────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate("/");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // ─── UI ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-5">
            <svg
              className="h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-green-600 mb-2">
          Order Placed! 🎉
        </h2>
        <p className="text-gray-500 mb-6">
          Thank you for your order. We'll deliver fresh masalas to you soon!
        </p>

        {/* Order Summary */}
        {orderDetails.orderId && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-orange-600 mb-2">Order Summary</h3>
            <div className="text-sm text-gray-600 flex flex-col gap-1">
              {orderDetails.orderId && (
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-medium">#{orderDetails.orderId}</span>
                </div>
              )}
              {orderDetails.name && (
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="font-medium">{orderDetails.name}</span>
                </div>
              )}
              {orderDetails.phone && (
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-medium">{orderDetails.phone}</span>
                </div>
              )}
              {orderDetails.address && (
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span className="font-medium text-right max-w-[60%]">
                    {orderDetails.address}
                  </span>
                </div>
              )}
              {orderDetails.total && (
                <div className="flex justify-between border-t border-orange-200 pt-2 mt-1">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-orange-600">
                    ₹{orderDetails.total}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guest nudge */}
        {isGuest && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm text-yellow-700">
            💡 Create an account with the same phone number to track all your
            orders anytime!
          </div>
        )}

        {/* Countdown */}
        <p className="text-gray-400 text-sm mb-6">
          Redirecting to home in{" "}
          <span className="text-orange-500 font-bold">{countdown}s</span>...
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Continue Shopping
          </button>

          {!isGuest && (
            <button
              onClick={() => navigate("/orders")}
              className="border border-orange-500 text-orange-500 py-2 rounded-lg font-semibold hover:bg-orange-50 transition"
            >
              View My Orders
            </button>
          )}

          {isGuest && (
            <button
              onClick={() => navigate("/register")}
              className="border border-orange-500 text-orange-500 py-2 rounded-lg font-semibold hover:bg-orange-50 transition"
            >
              Create Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
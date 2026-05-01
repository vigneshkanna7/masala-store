import React from "react";

const PayButton = ({ amount, customerInfo }) => {
  const handlePayment = async () => {
    try {
      // Step 1: Create order from Spring Boot backend
      const res = await fetch("http://localhost:8080/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const { orderId } = await res.json();

      // Step 2: Open Razorpay popup
      const options = {
        key: "rzp_test_xxxxxxxxxx", // 🔁 Replace with your Razorpay Key ID
        amount: amount * 100,
        currency: "INR",
        name: "Masala Store",
        description: "Order Payment",
        order_id: orderId,

        handler: async (response) => {
          // Step 3: Verify payment with backend
          const verify = await fetch("http://localhost:8080/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const result = await verify.json();

          if (result.success) {
            alert("✅ Payment Successful! Your order is confirmed.");
            // TODO: redirect to order confirmation page
          } else {
            alert("❌ Payment verification failed. Contact support.");
          }
        },

        prefill: {
          name: customerInfo?.name || "",
          email: customerInfo?.email || "",
          contact: customerInfo?.phone || "",
        },

        theme: { color: "#e65c00" }, // 🔁 Change to your brand color
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        alert("Payment failed: " + response.error.description);
      });

      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        backgroundColor: "#e65c00",
        color: "white",
        padding: "12px 24px",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
      }}
    >
      Pay ₹{amount}
    </button>
  );
};

export default PayButton;
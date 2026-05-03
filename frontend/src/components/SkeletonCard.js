import React from "react";

const pulseStyle = {
  animation: "pulse 1.5s ease-in-out infinite",
};

const pulse = `@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`;

// ─── Product Skeleton ──────────────────────────────────────
export const ProductSkeleton = () => (
  <div style={{
    background: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    padding: "16px", display: "flex", flexDirection: "column", gap: "12px",
    ...pulseStyle,
  }}>
    <style>{pulse}</style>
    <div style={{ width: "100%", height: "160px", background: "#e5e7eb", borderRadius: "8px" }} />
    <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", width: "75%" }} />
    <div style={{ height: "12px", background: "#e5e7eb", borderRadius: "4px", width: "100%" }} />
    <div style={{ height: "12px", background: "#e5e7eb", borderRadius: "4px", width: "66%" }} />
    <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", width: "33%" }} />
    <div style={{ height: "36px", background: "#fee2e2", borderRadius: "8px", marginTop: "auto" }} />
  </div>
);

// ─── Order Skeleton ────────────────────────────────────────
export const OrderSkeleton = () => (
  <div style={{
    background: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    padding: "16px", display: "flex", flexDirection: "column", gap: "12px",
    ...pulseStyle,
  }}>
    <style>{pulse}</style>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", width: "25%" }} />
      <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", width: "20%" }} />
    </div>
    <div style={{ height: "12px", background: "#e5e7eb", borderRadius: "4px", width: "50%" }} />
    <div style={{ height: "12px", background: "#e5e7eb", borderRadius: "4px", width: "66%" }} />
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
      <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", width: "25%" }} />
      <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", width: "20%" }} />
    </div>
  </div>
);

// ─── Cart Skeleton ─────────────────────────────────────────
export const CartSkeleton = () => (
  <div style={{
    background: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    padding: "16px", display: "flex", flexDirection: "column", gap: "12px",
    ...pulseStyle,
  }}>
    <style>{pulse}</style>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ height: "20px", background: "#e5e7eb", borderRadius: "4px", width: "33%" }} />
      <div style={{ height: "20px", background: "#e5e7eb", borderRadius: "4px", width: "16%" }} />
    </div>
    <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", width: "25%" }} />
    <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", width: "25%" }} />
    <div style={{ height: "12px", background: "#fee2e2", borderRadius: "4px", width: "16%" }} />
  </div>
);
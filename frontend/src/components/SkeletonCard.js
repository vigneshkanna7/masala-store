import React from "react";

// ─── Product Skeleton ─────────────────────────────────────
export const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 animate-pulse">
    <div className="w-full h-40 bg-gray-200 rounded-lg" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-200 rounded w-full" />
    <div className="h-3 bg-gray-200 rounded w-2/3" />
    <div className="h-4 bg-gray-200 rounded w-1/3" />
    <div className="h-9 bg-orange-100 rounded-lg mt-auto" />
  </div>
);

// ─── Order Skeleton ───────────────────────────────────────
export const OrderSkeleton = () => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 animate-pulse">
    <div className="flex justify-between">
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-1/5" />
    </div>
    <div className="h-3 bg-gray-200 rounded w-1/2" />
    <div className="h-3 bg-gray-200 rounded w-2/3" />
    <div className="flex justify-between mt-2">
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-1/5" />
    </div>
  </div>
);

// ─── Cart Skeleton ────────────────────────────────────────
export const CartSkeleton = () => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 animate-pulse">
    <div className="flex justify-between">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-5 bg-gray-200 rounded w-1/6" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-1/4" />
    <div className="h-4 bg-gray-200 rounded w-1/4" />
    <div className="h-3 bg-red-100 rounded w-1/6" />
  </div>
);
import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-[#1e1b2e] rounded-2xl overflow-hidden border border-white/5">
    <div className="skeleton aspect-square" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-6 w-24 rounded" />
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton h-16 rounded-lg" />
    ))}
  </div>
);

export const StatSkeleton = () => (
  <div className="bg-[#1e1b2e] rounded-2xl p-6 border border-white/5">
    <div className="skeleton h-4 w-24 rounded mb-3" />
    <div className="skeleton h-8 w-16 rounded mb-2" />
    <div className="skeleton h-3 w-20 rounded" />
  </div>
);

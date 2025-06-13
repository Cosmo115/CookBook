// /components/SkeletonLoader.js

import React from 'react';

// This component shows a placeholder UI that mimics the actual content layout.
// It improves perceived performance by giving an immediate visual response.
export const SkeletonLoader = () => (
  <div className="flex-1 p-8">
    <div className="max-w-6xl mx-auto">
      {/* Skeleton for Header */}
      <div className="animate-pulse mb-8 text-center">
        <div className="h-12 bg-slate-300 rounded-lg w-3/4 mx-auto mb-4"></div>
        <div className="h-6 bg-slate-300 rounded-lg w-1/2 mx-auto"></div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Skeleton for Ingredients */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-purple-200 animate-pulse">
          <div className="h-8 bg-slate-300 rounded-lg w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 rounded-lg"></div>
            <div className="h-10 bg-slate-200 rounded-lg w-5/6"></div>
            <div className="h-10 bg-slate-200 rounded-lg"></div>
            <div className="h-10 bg-slate-200 rounded-lg w-4/6"></div>
          </div>
        </div>
        
        {/* Skeleton for Steps */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-purple-200 animate-pulse">
          <div className="h-8 bg-slate-300 rounded-lg w-1/3 mb-6"></div>
          <div className="space-y-5">
            <div className="h-16 bg-slate-200 rounded-lg"></div>
            <div className="h-16 bg-slate-200 rounded-lg"></div>
            <div className="h-16 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
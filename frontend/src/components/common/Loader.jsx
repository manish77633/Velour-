import React from 'react';

export const Loader = ({ size = 'md', fullPage = false }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const spinner = (
    <div className={`${sizes[size]} border-2 border-soft border-t-warm rounded-full animate-spin`}/>
  );
  if (fullPage) return (
    <div className="min-h-screen flex items-center justify-center">{spinner}</div>
  );
  return spinner;
};

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="aspect-[3/4] bg-soft rounded-sm mb-3"/>
        <div className="h-3 bg-soft rounded w-1/2 mb-2"/>
        <div className="h-4 bg-soft rounded w-3/4 mb-2"/>
        <div className="h-3 bg-soft rounded w-1/3"/>
      </div>
    ))}
  </div>
);

export default Loader;

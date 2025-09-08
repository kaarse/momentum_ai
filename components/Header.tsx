import React from 'react';

const SparkleIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-indigo-500">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        <path d="M5 2L6 5" />
        <path d="M19 2L18 5" />
        <path d="M22 19L19 18" />
        <path d="M2 5L5 6" />
        <path d="M22 5L19 6" />
        <path d="M5 22L6 19" />
        <path d="M19 22L18 19" />
        <path d="M2 19L5 18" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center text-center">
        <SparkleIcon />
        <div className="ml-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-50">
            Momentum AI
            </h1>
            <p className="text-sm text-slate-400 mt-1">Marketing Automation Platform</p>
        </div>
      </div>
    </header>
  );
};
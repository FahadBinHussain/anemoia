
import React from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);


const UploadPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] py-12 text-center">
      <div className="bg-slate-800 p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700 neon-border-cyan">
        <UploadIcon className="w-16 h-16 text-cyan-400 mx-auto mb-6 neon-text-cyan" />
        <h1 className="text-3xl font-bold mb-4 text-slate-100">Share Your Vision</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          This is where you'd upload your masterpiece to the Anemoia collective. This feature is currently a concept.
        </p>
        <div className="bg-slate-700/50 p-6 rounded-lg border border-dashed border-cyan-500/50 text-center cursor-pointer hover:border-cyan-400 transition-colors">
          <p className="text-slate-300">Drag & Drop your artwork here</p>
          <p className="text-sm text-slate-500 mt-1">or</p>
          <Button variant="primary" className="mt-3">
            Select File
          </Button>
        </div>
         <p className="text-xs text-slate-500 mt-8">
          Supported formats: JPG, PNG, GIF. Max file size: Conceptual.
        </p>
        <Link to="/">
            <Button variant="outline" className="mt-8 text-pink-400 border-pink-500">
                Back to Explore
            </Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadPage;

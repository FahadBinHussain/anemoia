
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 shadow-inner">
      <div className="container mx-auto px-4 py-8 text-center text-slate-500">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Anemoia. All rights reserved (concept).
        </p>
        <p className="text-xs mt-2">
          Crafted with <span className="text-pink-500">&hearts;</span> for the digital frontier. Images via Picsum.
        </p>
        <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
            <span className="text-slate-600">|</span>
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
             <span className="text-slate-600">|</span>
            <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

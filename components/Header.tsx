
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NavLinkItem } from '../types';
import Button from './Button';

const MenuIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const Header: React.FC = () => {
  const { currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: NavLinkItem[] = [
    { label: 'Explore', href: '/' },
    { label: 'Upload Art', href: '/upload', authRequired: true, isButton: true },
    { label: 'Sign In', href: '/login', hideWhenAuth: true, isButton: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const renderNavLink = (item: NavLinkItem, isMobile: boolean = false) => {
    if (item.authRequired && !currentUser) return null;
    if (item.hideWhenAuth && currentUser) return null;

    const commonClasses = isMobile 
      ? "block w-full text-left px-4 py-3 text-lg hover:bg-slate-700 transition-colors" 
      : "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150";
    
    const activeClasses = isMobile ? "bg-cyan-600 text-white" : "text-white neon-text-cyan"; // Simplified active for mobile
    const inactiveClasses = isMobile ? "text-slate-200" : "text-slate-300 hover:text-white hover:neon-text-cyan";


    if (item.isButton) {
       return (
        <Button 
          key={item.label}
          onClick={() => { navigate(item.href); if(isMobile) setMobileMenuOpen(false); }}
          variant="outline"
          className={`${isMobile ? 'w-full text-center my-1' : ''} border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900`}
        >
          {item.label}
        </Button>
       )
    }
    
    return (
      <NavLink
        key={item.label}
        to={item.href}
        onClick={() => { if(isMobile) setMobileMenuOpen(false); }}
        className={({ isActive }: {isActive: boolean}) => 
           `${commonClasses} ${isActive && !isMobile ? activeClasses : inactiveClasses}`
        }
        end // Add end prop for more precise active matching, especially for '/'
      >
        {item.label}
      </NavLink>
    );
  }


  return (
    <header className="bg-slate-900/80 backdrop-blur-md shadow-lg shadow-cyan-500/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-3xl font-bold tracking-tighter">
            <span className="text-cyan-400 neon-text-cyan">A</span>
            <span className="text-pink-500 neon-text-pink">n</span>
            <span className="text-slate-200">emoia</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((item) => renderNavLink(item))}
            {currentUser && (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:neon-text-cyan">
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full border-2 border-pink-500" />
                  <span>{currentUser.name}</span>
                   <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-xl py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out transform scale-95 group-hover:scale-100 origin-top-right border border-slate-700">
                  <button 
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-pink-600 hover:text-white transition-colors"
                  >
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-2 rounded-md hover:bg-slate-700"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <CloseIcon className="w-7 h-7 text-pink-500"/> : <MenuIcon className="w-7 h-7 text-cyan-400"/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-slate-900/95 backdrop-blur-sm shadow-2xl z-40 pb-4 border-t border-slate-700">
          <nav className="flex flex-col space-y-1 px-2 pt-2 pb-3">
            {navLinks.map((item) => renderNavLink(item, true))}
            {currentUser && (
               <>
                <div className="px-4 py-3 border-t border-slate-700 mt-2">
                    <div className="flex items-center space-x-3">
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full border-2 border-pink-500" />
                        <div>
                            <p className="text-base font-medium text-white">{currentUser.name}</p>
                            <p className="text-sm font-medium text-slate-400">{currentUser.email}</p>
                        </div>
                    </div>
                </div>
                <Button 
                    onClick={handleLogout}
                    disabled={isLoading}
                    variant="danger"
                    className="w-full text-center mt-2"
                  >
                    {isLoading ? 'Logging out...' : 'Logout'}
                </Button>
               </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

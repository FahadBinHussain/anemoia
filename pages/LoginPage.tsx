import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

// Style for the Google Sign-In button container to enhance neon aesthetics
const googleButtonStyles = `
  .google-btn-container {
    transition: all 0.3s ease;
    border-radius: 9999px;
    position: relative;
  }
  .google-btn-container:hover {
    box-shadow: 0 0 15px #06b6d4, 0 0 20px #06b6d4 inset !important;
    transform: translateY(-2px);
    animation: pulse-google-button 2s infinite;
  }
  .google-btn-container > div {
    width: 100% !important; 
  }
  
  @keyframes pulse-google-button {
    0% {
      box-shadow: 0 0 15px #06b6d4, 0 0 15px #06b6d4 inset;
    }
    50% {
      box-shadow: 0 0 20px #06b6d4, 0 0 25px #06b6d4 inset;
    }
    100% {
      box-shadow: 0 0 15px #06b6d4, 0 0 15px #06b6d4 inset;
    }
  }
`;

const GoogleIcon: React.FC = () => (
  <svg className="w-5 h-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <title>Google</title>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    <path fill="none" d="M1 1h22v22H1z"/>
  </svg>
);

const UserIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);


const LoginPage: React.FC = () => {
  const { login, demoLogin, isLoading, currentUser } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (currentUser) {
      // Already handled by Navigate in App.tsx, but good for direct access scenario
      return <p className="text-center text-slate-300">Redirecting...</p>;
  }

  const googleButtonDisabled = isLoading;
  let googleButtonText = 'Sign In with Google';
  if (isLoading) {
    googleButtonText = 'Signing In...';
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] py-12">
      <style dangerouslySetInnerHTML={{__html: googleButtonStyles}} />
      <div className="bg-slate-800 p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 neon-border-pink">
        <h2 className="text-3xl font-bold text-center mb-3">
          <span className="text-pink-500 neon-text-pink">Join</span>
          <span className="text-slate-100"> Anemoia</span>
        </h2>
        <p className="text-slate-400 text-center mb-8">
          Access the digital frontier. Sign in to continue.
        </p>
        
        <div className="space-y-4">
            {/* Container for the Google Sign-In button */}
            <div id="google-signin-button" className="w-full flex justify-center min-h-[42px] google-btn-container"></div>

            <Button
                onClick={demoLogin}
                variant="outline"
                size="lg"
                className="w-full text-slate-200 border-cyan-600 hover:bg-cyan-700/50 hover:text-cyan-300 focus:ring-cyan-500 text-cyan-400"
                leftIcon={<UserIcon className="text-cyan-400"/>}
                aria-label="Sign in as Demo User"
                // Demo login is instant, so doesn't need its own loading state usually
                // disabled={isLoading} // Optionally disable if main isLoading is true
            >
                Sign In as Demo User
            </Button>
        </div>

        {isLoading && <p className="text-xs text-slate-400 mt-4 text-center">Attempting Google Sign-In...</p>}


        <p className="text-xs text-slate-500 mt-8 text-center">
          By signing in, you agree to our <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a> and <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a> (conceptual).
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop is a utility component that scrolls the window to the top
 * whenever the pathname in the URL changes.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop; 
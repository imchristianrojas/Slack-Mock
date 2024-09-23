// ViewContext.jsx
import {createContext, useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';

const ViewContext = createContext();

export const ViewTypes = {
  MOBILE: 'mobile',
  DESKTOP: 'desktop',
  NARROW: 'narrow',
};

/** View provider
 *
 * @param {*} Something
 * @return {Object} newly resize view
 */
export function ViewProvider({children}) {
  const [currentView, setCurrentView] = useState(ViewTypes.DESKTOP);
  console.log('This is the current view,', currentView);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentView(ViewTypes.MOBILE);
      } else if (window.innerWidth < 1024 &&
          window.innerWidth >= 768) {
        setCurrentView(ViewTypes.NARROW);
      } else {
        setCurrentView(ViewTypes.DESKTOP);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial view

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ViewContext.Provider value={{currentView}}>
      {children}
    </ViewContext.Provider>
  );
}

export const useView = () => useContext(ViewContext);

ViewProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

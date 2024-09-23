// AuthContext.jsx
import {createContext, useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

/** Authprovider
 *
 * @param {ReactComponent} ReactsComponent
 * @return {Object} return state of user and login
 */
export function AuthProvider({children}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    //  Planning on using stay loggin feature
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    const {name, accessToken} = userData;
    const userToStore = {name, accessToken};
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('token', accessToken); // Store token separately
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove token on logout
  };

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

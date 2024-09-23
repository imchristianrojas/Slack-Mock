
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './Authcontext';
import Login from './Login';
import {ViewProvider} from './Viewcontext';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';
import Home from './Home';

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#E6E6FA',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    text: {
      primary: '#333',
    },
  },
});

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <ViewProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </ViewProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

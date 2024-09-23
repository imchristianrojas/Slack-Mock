import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
//  import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
//  import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {ThemeProvider} from '@mui/material/styles';
import {useView, ViewTypes} from './Viewcontext';
import {useAuth} from './Authcontext';
import {theme} from './App';
import {useNavigate} from 'react-router-dom';


/** Renders the Sign in Page
 *
 * @return {JSX} the Sign in Page
 */
export default function Login() {
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {currentView} = useView();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('This is the email and password', {email, password});

    fetch('http://localhost:3010/v0/login', {
      method: 'POST',
      body: JSON.stringify({email, password}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401) {
              throw new Error('Invalid credentials');
            }
          }
          return res.json();
        })
        .then((json) => {
          login(json);
          navigate('/home');
        })
        .catch((err) => {
          alert('Error logging in, please try again');
        });
    setEmail('');
    setPassword('');
  };

  const loginForm = (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
      <TextField
        aria-label='Email Address'
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{mt: 3, mb: 2}}
      >
      Sign In
      </Button>
      <Link href="#" variant="body2">
        {'Don\'t have an account? Sign Up'}
      </Link>
    </Box>
  );
  if (currentView === ViewTypes.DESKTOP) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{m: 1}} src="/favicon.ico" alt="Avatar" />
            <Typography component="h1" variant="h5">
              Slack(MOCK) Sign In
            </Typography>
            {loginForm}
          </Box>
        </Container>
      </ThemeProvider>
    );
  } else if (currentView === ViewTypes.MOBILE) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{m: 1}} src="/favicon.ico" alt="Avatar" />
            <Typography component="h1" variant="h6">
              Slack(MOCK) Sign In
            </Typography>
            {loginForm}
          </Box>
        </Container>
      </ThemeProvider>
    );
  } else if (currentView === ViewTypes.NARROW) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{m: 1}} src="/favicon.ico" alt="Avatar" />
            <Typography component="h1" variant="h6">
              Slack(MOCK) Sign In
            </Typography>
            {loginForm}
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

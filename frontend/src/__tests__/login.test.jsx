
//
import {it, beforeAll, afterAll, afterEach, expect, describe, vi,
  beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import Login from '../Login';
import App from '../App';
import {ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider, useAuth} from '../Authcontext';
import {ViewProvider} from '../Viewcontext';
import {theme} from '../App';

// import {fireEvent} from '@testing-library/react';

//  import userEvent from '@testing-library/user-event';

//  const URL = 'http://localhost:3010/v0/login';

/** Custom Render Component
 *
 * @param {*} ui
 * @param {*} options
 * @return {Object}
 */
const customRender = (ui, options) => {
  return render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <ViewProvider>
              {ui}
            </ViewProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>,
      options,
  );
};

/**
 *
 */
// function resetAuthState() {
//   const {logout} = useAuth();
//   logout();
// }

const server = setupServer(
    http.post('http://localhost:3010/v0/login', async ({request}) => {
      const body = await request.json();
      if (body.email === 'test@example.com' &&
          body.password === 'password123') {
        return HttpResponse.json({
          name: 'Jian Yang',
          accessToken: 'Eric is your refrigera running? This is Mike Hunt',
        }, {status: 200});
      }
      return new HttpResponse(null, {status: 401});
    }),
);

beforeAll(() => {
  server.listen();
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  server.resetHandlers();
  //  resetAuthState();
  vi.clearAllMocks();
});
afterAll(() => {
  server.close();
  vi.restoreAllMocks();
});

describe('Login Screen Basics', () => {
  it('Show Slack(MOCK) Sign In', async () => {
    render(<App />);
    await screen.findByText('Slack(MOCK) Sign In');
    expect(screen.getByText(
        'Slack(MOCK) Sign In')).toBeInTheDocument();
    await screen.findByText('Email Address');
    expect(screen.getByText(
        'Email Address')).toBeInTheDocument();
    await screen.findByText('Password');
    expect(screen.getByText(
        'Password')).toBeInTheDocument();
  });
});


describe('Login Page Credential Entry', () => {
  it('Successful Login', async () => {
    const user = userEvent.setup();

    // wrapper to test indivial comp
    const TestComponent = () => {
      const {user} = useAuth();
      return (
        <div>
          <Login />
          {user && <div data-testid="user-info">{user.name}</div>}
        </div>
      );
    };

    customRender(<TestComponent />);

    const emailInput = screen.getByRole('textbox', {name: /email address/i});
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    await user.click(submitButton);

    await waitFor(() => {
      // Check to see if went through
      expect(screen.getByTestId('user-info')).toHaveTextContent('Jian Yang');

      // Check localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser).toEqual({
        name: 'Jian Yang',
        accessToken: 'Eric is your refrigera running? This is Mike Hunt',
      });
    });

    localStorage.clear();
  });
  it('Unsuccessful Login', async () => {
    const user = userEvent.setup();
    //  resetAuthState();
    customRender(<Login />);

    const emailInput = screen.getByRole('textbox', {name: /email address/i});
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    await user.type(emailInput, 'notCoolman@.com');
    await user.type(passwordInput, 'muahaha');

    console.log('Email value:', emailInput.value);
    console.log('Password value:', passwordInput.value);

    await user.click(submitButton);

    await waitFor(() => {
      expect(window.alert).
          toHaveBeenCalledWith('Error logging in, please try again');
    });
    expect(screen.getByText('Slack(MOCK) Sign In')).toBeInTheDocument();
  });
});

describe('Login Component Views', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  afterEach(() => {
    // Reset the innerWidth after each test
    window.innerWidth = originalInnerWidth;
  });

  it('renders desktop view for large screens', () => {
    window.innerWidth = 1025;
    window.dispatchEvent(new Event('resize'));

    customRender(<Login />);

    expect(screen.getByRole('heading', {name: /Slack\(MOCK\) Sign In/i}))
        .toHaveStyle('font-size: 1.5rem'); // h5 variant
  });

  it('renders narrow view for medium screens', () => {
    window.innerWidth = 800;
    window.dispatchEvent(new Event('resize'));

    customRender(<Login />);

    expect(screen.getByRole('heading', {name: /Slack\(MOCK\) Sign In/i}))
        .toHaveStyle('font-size: 1.25rem'); // h6 variant
  });

  it('renders mobile view for small screens', () => {
    window.innerWidth = 600;
    window.dispatchEvent(new Event('resize'));

    customRender(<Login />);

    expect(screen.getByRole('heading', {name: /Slack\(MOCK\) Sign In/i}))
        .toHaveStyle('font-size: 1.25rem'); // h6 variant
  });
});


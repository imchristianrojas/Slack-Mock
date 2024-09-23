import {it, expect, describe, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import {AuthProvider, useAuth} from '../Authcontext';
import ButtonBar from '../ButtonBar';

// Mock useNavigate and useAuth
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../Authcontext', async () => {
  const actual = await vi.importActual('../Authcontext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

const customRender = (ui, options) => {
  return render(
      <BrowserRouter>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </BrowserRouter>,
      options,
  );
};

describe('ButtonBar Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({logout: vi.fn()});
    useNavigate.mockReturnValue(vi.fn());
  });
  it('renders Home and Logout buttons', () => {
    customRender(<ButtonBar />);
    expect(screen.getByRole('button', {name: /home/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /logout/i})).toBeInTheDocument();
  });

  it('calls navigate when Home button is clicked', async () => {
    const user = userEvent.setup();
    const navigateMock = vi.fn();
    useNavigate.mockReturnValue(navigateMock);

    customRender(<ButtonBar />);

    await user.click(screen.getByRole('button', {name: /home/i}));
    expect(navigateMock).toHaveBeenCalledWith('/home');
  });

  it('calls logout and navigate when Logout button is clicked', async () => {
    const user = userEvent.setup();
    const navigateMock = vi.fn();
    const logoutMock = vi.fn();
    useNavigate.mockReturnValue(navigateMock);
    useAuth.mockReturnValue({logout: logoutMock});

    customRender(<ButtonBar />);

    await user.click(screen.getByRole('button', {name: /logout/i}));
    expect(logoutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});

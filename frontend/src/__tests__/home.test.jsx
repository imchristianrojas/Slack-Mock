import {it, expect, describe, vi, beforeEach} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import {AuthProvider, useAuth} from '../Authcontext';
import Home from '../Home';

// Mock child components
vi.mock('../WorkspaceSelector', () => ({
  default: vi.fn().mockReturnValue(
      <div data-testid="mock-workspace-selector" />),
}));

vi.mock('../ButtonBar', () => ({
  default: vi.fn().mockReturnValue(
      <div data-testid="mock-button-bar" />),
}));

// Mock useAuth hook
vi.mock('../Authcontext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Home Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('redirects to login page if user is not authenticated', () => {
    useAuth.mockReturnValue({user: null});

    render(
        <BrowserRouter>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </BrowserRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith('/', {replace: true});
  });

  it('renders workspace selector and button bar when user is auth', () => {
    useAuth.mockReturnValue({user: {name: 'Test User'}});

    render(
        <BrowserRouter>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </BrowserRouter>,
    );

    expect(screen.getByTestId('mock-workspace-selector'))
        .toBeInTheDocument();
    expect(screen.getByTestId('mock-button-bar'))
        .toBeInTheDocument();
  });
});

vi.mock('../ChannelMessages', () => ({
  default: vi.fn(({channel, onBack}) => (
    <div data-testid="mock-channel-messages">
      <span>{channel.name}</span>
      <button onClick={onBack}>Back</button>
    </div>
  )),
}));

// Update WorkspaceSelector mock to allow triggering channel selection
vi.mock('../WorkspaceSelector', () => ({
  default: vi.fn(({onChannelSelect}) => (
    <div data-testid="mock-workspace-selector">
      <button onClick={() => onChannelSelect({id: '1', name: 'Test Channel'})}>
        Select Channel
      </button>
    </div>
  )),
}));

describe('Back Button Thingy', () => {
  // Existing setup...
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('handles channel selection and back navigation', () => {
    useAuth.mockReturnValue({user: {name: 'Test User'}});

    render(
        <BrowserRouter>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </BrowserRouter>,
    );

    // Initially, WorkspaceSelector should be visible
    expect(screen.getByTestId('mock-workspace-selector')).toBeInTheDocument();

    // Select a channel
    fireEvent.click(screen.getByText('Select Channel'));

    // ChannelMessages should now be visible
    expect(screen.getByTestId('mock-channel-messages')).toBeInTheDocument();
    expect(screen.getByText('Test Channel')).toBeInTheDocument();

    // Navigate back
    fireEvent.click(screen.getByText('Back'));

    // WorkspaceSelector should be visible again
    expect(screen.getByTestId('mock-workspace-selector')).toBeInTheDocument();
  });

  it('renders with the correct container styles', () => {
    useAuth.mockReturnValue({user: {name: 'Test User'}});

    const {container} = render(
        <BrowserRouter>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </BrowserRouter>,
    );

    const containerElement = container.firstChild;
    expect(containerElement).toHaveStyle({
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    });
  });
});

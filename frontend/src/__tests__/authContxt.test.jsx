import {it, expect, describe, vi, beforeEach, afterEach} from 'vitest';
import {render, act, renderHook} from '@testing-library/react';
import {AuthProvider, useAuth} from '../Authcontext';

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides initial null user state', () => {
    const TestComponent = () => {
      const {user} = useAuth();
      if (!user) return <div>{'No user'}</div>;
    };

    const {getByText} = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
    );

    expect(getByText('No user')).toBeInTheDocument();
  });

  it('updates user state on login', () => {
    const {result} = renderHook(() => useAuth(), {wrapper: AuthProvider});

    act(() => {
      result.current.login({name: 'Test User', accessToken: 'test-token'});
    });

    expect(result.current.user)
        .toEqual({name: 'Test User', accessToken: 'test-token'});
    expect(JSON.parse(localStorage.getItem('user')))
        .toEqual({name: 'Test User', accessToken: 'test-token'});
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('clears user state on logout', () => {
    const {result} = renderHook(() => useAuth(), {wrapper: AuthProvider});

    act(() => {
      result.current.login({name: 'Test User', accessToken: 'test-token'});
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('loads user from localStorage on initial render', () => {
    localStorage.setItem('user',
        JSON.stringify({name: 'Stored User', accessToken: 'stored-token'}));

    const {result} = renderHook(() => useAuth(), {wrapper: AuthProvider});

    expect(result.current.user)
        .toEqual({name: 'Stored User', accessToken: 'stored-token'});
  });
});

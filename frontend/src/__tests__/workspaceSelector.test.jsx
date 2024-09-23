import {it, expect, describe, vi, beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkspaceSelector from '../WorkspaceSelector';

// Mock fetch
window.fetch = vi.fn();

/**
 *
 * @param {data} data
 */
function mockFetch(data) {
  window.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
}
// Mock ChannelList component
vi.mock('../Channels', () => ({
  default: vi.fn(() => <div data-testid="mock-channel-list" />),
}));

describe('WorkspaceSelector', () => {
  const mockOnWorkspaceChange = vi.fn();
  const mockOnChannelSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'fake-token');
  });

  it('renders loading state initially', () => {
    mockFetch([]);
    render(<WorkspaceSelector onWorkspaceChange={mockOnWorkspaceChange}
      currentWorkspace="" />);
    expect(screen.getByText('Loading workspaces...')).toBeInTheDocument();
  });

  it('renders workspaces after loading', async () => {
    const mockWorkspaces = [
      {id: '1', name: 'Workspace 1'},
      {id: '2', name: 'Workspace 2'},
    ];
    mockFetch(mockWorkspaces);

    render(<WorkspaceSelector onWorkspaceChange={mockOnWorkspaceChange}
      currentWorkspace="" />);

    await waitFor(() => {
      expect(screen.getByLabelText('Workspaces')).toBeInTheDocument();
    });

    const select = screen.getByLabelText('Workspaces');
    await userEvent.click(select);

    expect(screen.getByText('Workspace 1')).toBeInTheDocument();
    expect(screen.getByText('Workspace 2')).toBeInTheDocument();
  });

  it('calls onWorkspaceChange when a workspace is selected', async () => {
    const mockWorkspaces = [
      {id: '1', name: 'Workspace 1'},
      {id: '2', name: 'Workspace 2'},
    ];
    mockFetch(mockWorkspaces);

    render(<WorkspaceSelector onWorkspaceChange={mockOnWorkspaceChange}
      currentWorkspace="" />);

    await waitFor(() => {
      expect(screen.getByLabelText('Workspaces')).toBeInTheDocument();
    });

    const select = screen.getByLabelText('Workspaces');
    await userEvent.click(select);
    await userEvent.click(screen.getByText('Workspace 1'));

    expect(mockOnWorkspaceChange).toHaveBeenCalledWith(mockWorkspaces[0]);
  });

  it('displays an error message when fetch fails', async () => {
    window.fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(<WorkspaceSelector onWorkspaceChange={mockOnWorkspaceChange}
      currentWorkspace="" />);

    await waitFor(() => {
      expect(screen.getByText(
          'Failed to fetch workspaces. Please try again later.'))
          .toBeInTheDocument();
    });
  });

  it('fetches workspaces on mount', async () => {
    const mockWorkspaces = [
      {id: '1', name: 'Workspace 1'},
      {id: '2', name: 'Workspace 2'},
    ];
    mockFetch(mockWorkspaces);

    render(<WorkspaceSelector
      onWorkspaceChange={mockOnWorkspaceChange}
      onChannelSelect={mockOnChannelSelect}
      currentWorkspace=""
    />);

    await waitFor(() => {
      expect(screen.getByLabelText('Workspaces')).toBeInTheDocument();
    });

    expect(window.fetch).toHaveBeenCalledWith(
        'http://localhost:3010/v0/workspaces', expect.any(Object));
  });

  it('fetches channels when a workspace is selected', async () => {
    const mockWorkspaces = [
      {id: '1', name: 'Workspace 1'},
      {id: '2', name: 'Workspace 2'},
    ];
    const mockChannels =
      {
        'channels': [
          {
            'channel_id': '252cb119-3d1b-4960-b85a-2b4d96a28948',
            'channel_name': 'Force Training',
            'channel_data': {
              'name': 'Force Training',
              'content': [
                {
                  'from': 'Obi Wan',
                  'message': 'I am Obi Wan!',
                },
                {
                  'from': 'Yoda',
                  'message': 'I am Yoda!',
                },
              ],
              'description': 'A channel for Jedi matters',
            },
          },
          {
            'channel_id': '7fa921c3-d395-49d3-a668-a005e1c83f5c',
            'channel_name': 'Lightsaber Techniques',
            'channel_data': {
              'name': 'Lightsaber Techniques',
              'content': [
                {
                  'from': 'Obi Wan',
                  'message': 'I am Obi Wan!',
                },
                {
                  'from': 'Yoda',
                  'message': 'I am Yoda!',
                },
              ],
              'description': 'A channel for Jedi matters',
            },
          },
        ]};

    // Mock workspace fetch
    mockFetch(mockWorkspaces);

    render(<WorkspaceSelector
      onWorkspaceChange={mockOnWorkspaceChange}
      onChannelSelect={mockOnChannelSelect}
      currentWorkspace=""
    />);

    await waitFor(() => {
      expect(screen.getByLabelText(
          'Workspaces')).toBeInTheDocument();
    });

    // Mock channel fetch
    mockFetch(mockChannels);

    const select = screen.getByLabelText('Workspaces');
    await userEvent.click(select);
    await userEvent.click(screen.getByText('Workspace 1'));

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith(
          'http://localhost:3010/v0/channels?workspaceId=1',
          expect.any(Object),
      );
    });

    expect(screen.getByTestId('mock-channel-list'))
        .toBeInTheDocument();
  });
});

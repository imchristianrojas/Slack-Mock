import {it, expect, describe, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInterface from '../ChatInterface';

// Mock fetch
window.fetch = vi.fn();

/** mock Response
 *
 * @param {fakeData} data
 */
function mockFetchResponse(data) {
  window.fetch.mockResolvedValueOnce({
    ok: true,
  });
}

describe('ChatInterface', () => {
  const mockChatData =
    {
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
    };
  const mockChannelID = 'channel123';

  const originalConsoleError = console.error;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'fake-token');
    console.error = vi.fn();
  });

  afterEach(() =>{
    console.error = originalConsoleError;
  });
  it('renders chat messages', () => {
    render(<ChatInterface chatData={mockChatData} channelID={mockChannelID} />);

    expect(screen.getByText('I am Obi Wan!')).toBeInTheDocument();
    expect(screen.getByText('I am Yoda!')).toBeInTheDocument();
  });

  it('allows user to type a message', async () => {
    render(<ChatInterface chatData={mockChatData} channelID={mockChannelID} />);

    const input = screen.getByPlaceholderText('Type a message');
    await userEvent.type(input, 'Darth Vader sucks');

    expect(input).toHaveValue('Darth Vader sucks');
  });

  it('sends a message when the send button is clicked', async () => {
    mockFetchResponse({success: true});

    render(<ChatInterface chatData={mockChatData} channelID={mockChannelID} />);

    const input = screen.getByPlaceholderText('Type a message');
    await userEvent.type(input, 'Luke is cool');

    const sendButton = screen.getByRole('button');
    await userEvent.click(sendButton);

    expect(window.fetch).toHaveBeenCalledWith(
        'http://localhost:3010/v0/messages',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake-token',
          }),
          body: JSON.stringify({
            channelId: mockChannelID,
            content: 'Luke is cool',
          }),
        }),
    );

    await waitFor(() => {
      expect(screen.getByText('Luke is cool')).toBeInTheDocument();
    });
    expect(input).toHaveValue('');
  });

  it('sends a message when Enter key is pressed', async () => {
    mockFetchResponse({success: true});

    render(<ChatInterface chatData={mockChatData} channelID={mockChannelID} />);

    const input = screen.getByPlaceholderText('Type a message');
    await userEvent.type(input, 'Yoda is funny{enter}');

    expect(window.fetch).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('Yoda is funny')).toBeInTheDocument();
    });

    expect(input).toHaveValue('');
  });

  it('does not send an empty message', async () => {
    render(<ChatInterface chatData={mockChatData} channelID={mockChannelID} />);

    const sendButton = screen.getByRole('button');
    await userEvent.click(sendButton);

    expect(window.fetch).not.toHaveBeenCalled();
  });
});

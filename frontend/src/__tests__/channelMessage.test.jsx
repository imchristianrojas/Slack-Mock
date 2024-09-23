import {it, expect, describe, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChannelMessages from '../ChannelMessages';

describe('ChannelMessages', () => {
  const mockChannel =
    {
      'channel_id': '252cb119-3d1b-4960-b85a-2b4d96a28948',
      'channel_name': 'General',
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
    };

  const mockOnBack = vi.fn();

  it('renders the channel name correctly', () => {
    render(<ChannelMessages channel={mockChannel} onBack={mockOnBack} />);

    expect(screen.getByText('#General')).toBeInTheDocument();
  });

  it('displays the channel data', () => {
    render(<ChannelMessages channel={mockChannel} onBack={mockOnBack} />);
    expect(screen.getByText(/I am Obi Wan!/)).toBeInTheDocument();
  });

  it('calls onBack when the back button is clicked', async () => {
    render(<ChannelMessages channel={mockChannel} onBack={mockOnBack} />);

    const backButton = screen.getByLabelText('back');
    await userEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });
});

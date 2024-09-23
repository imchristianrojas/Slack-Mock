import {it, expect, describe, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChannelList from '../Channels';

describe('ChannelList', () => {
  const mockChannels = [
    {channel_id: '1', channel_name: 'General',
      channel_data: {description: 'General channel'}},
    {channel_id: '2', channel_name: 'Random',
      channel_data: {description: 'Random stuff'}},
  ];

  it('renders the channel list correctly', () => {
    const mockOnChannelSelect = vi.fn();
    render(<ChannelList channels={mockChannels}
      onChannelSelect={mockOnChannelSelect} />);

    expect(screen.getByText('Channels')).toBeInTheDocument();
    expect(screen.getByText('# General')).toBeInTheDocument();
    expect(screen.getByText('# Random')).toBeInTheDocument();
  });

  it('calls onChannelSelect with the correct channel', async () => {
    const mockOnChannelSelect = vi.fn();
    render(<ChannelList channels={mockChannels}
      onChannelSelect={mockOnChannelSelect} />);

    const generalChannel = screen.getByText('# General');
    await userEvent.click(generalChannel);

    expect(mockOnChannelSelect).toHaveBeenCalledWith(mockChannels[0]);
  });

  it('calls onChannelSelect with a different channel', async () => {
    const mockOnChannelSelect = vi.fn();
    render(<ChannelList channels={mockChannels}
      onChannelSelect={mockOnChannelSelect} />);

    const generalChannel = screen.getByText('# General');
    await userEvent.click(generalChannel);

    const randomChannel = screen.getByText('# Random');
    await userEvent.click(randomChannel);

    expect(mockOnChannelSelect).toHaveBeenCalledWith(mockChannels[1]);
  });

  it('does not show channel data directly in the ChannelList component', () => {
    const mockOnChannelSelect = vi.fn();
    render(<ChannelList channels={mockChannels}
      onChannelSelect={mockOnChannelSelect} />);

    expect(screen.queryByText('Channel Data:')).not.toBeInTheDocument();
  });
});

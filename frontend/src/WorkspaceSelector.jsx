import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {PropTypes} from 'prop-types';
import {useState, useEffect} from 'react';
import ChannelList from './Channels';
/** workplaceslector
 *
 * @param {props} param0
 * @return {JSX}
 */
export default function WorkspaceSelector(
    {onWorkspaceChange, currentWorkspace, onChannelSelect}) {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channels, setChannels] = useState([]);

  const fetchChannels = async (workspaceId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3010/v0/channels?workspaceId=${workspaceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const channelsData = await response.json();
    setChannels(channelsData.channels);
  };

  const handleChange = async (event) => {
    const selectedWorkspace = workspaces
        .find((w) => w.name === event.target.value);
    onWorkspaceChange(selectedWorkspace);
    await fetchChannels(selectedWorkspace.id);
  };

  const fetchWorkspaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3010/v0/workspaces', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setWorkspaces(data);

      // Set the first workspace as the current workspace
      if (data.length > 0) {
        onWorkspaceChange(data[0]);
        await fetchChannels(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      setError('Failed to fetch workspaces. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  if (isLoading) {
    return <div>Loading workspaces...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={{minWidth: 120}}>
      <FormControl fullWidth>
        <InputLabel id="workspace-select-label">Workspaces</InputLabel>
        <Select
          labelId="workspace-select-label"
          id="workspace-select"
          value={currentWorkspace.name || ''}
          label="Workspaces"
          onChange={handleChange}
        >
          {workspaces.map((workspace) => (
            <MenuItem key={workspace.id} value={workspace.name}>
              {workspace.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {channels.length > 0 && (
        <ChannelList channels={channels} onChannelSelect={onChannelSelect}/>
      )}
    </Box>
  );
}

WorkspaceSelector.propTypes = {
  onWorkspaceChange: PropTypes.func.isRequired,
  currentWorkspace: PropTypes.object.isRequired,
  onChannelSelect: PropTypes.func.isRequired,
};

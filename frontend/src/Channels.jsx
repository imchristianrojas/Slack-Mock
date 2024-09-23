
import {List, ListItem, ListItemText, Typography} from '@mui/material';
import {PropTypes} from 'prop-types';

/** Channel Component
 *
 * @param {Array} channels
 * @return {JSX}
 */
function ChannelList({channels, onChannelSelect}) {
  return (
    <div>
      <Typography variant="h6">Channels</Typography>
      <List>
        {channels.map((channel) => (
          <ListItem
            button
            key={channel.channel_id}
            onClick={() => onChannelSelect(channel)}
          >
            <ListItemText primary={`# ${channel.channel_name}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}


export default ChannelList;

ChannelList.propTypes = {
  channels: PropTypes.array.isRequired,
  onChannelSelect: PropTypes.func.isRequired,
};


import {Typography, Box, IconButton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {PropTypes} from 'prop-types';
import ChatInterface from './ChatInterface';
/** Show Messages
 *
 * @param {props} param0
 * @return {JSX}
 */
function ChannelMessages({channel, onBack}) {
  const channelData = channel.channel_data;
  const channelID = channel.channel_id;

  console.log('i am over here', channelID);
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={onBack} edge="start" aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" ml={1}>
          #{channel.channel_name}
        </Typography>
      </Box>
      <ChatInterface chatData={channelData} channelID={channelID}/>
    </Box>
  );
}

ChannelMessages.propTypes = {
  channel: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ChannelMessages;

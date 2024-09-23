import {useState, useEffect} from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {PropTypes} from 'prop-types';

/**
 *
 * @return {JSX}
 */
export default function ChatInterface({chatData, channelID}) {
  const [message, setMessage] = useState('');
  const [content, setContent] = useState([]);
  //  console.log(channelID);

  useEffect(() => {
    setContent(chatData.content);
  }, [chatData]);

  const handleSend = async () => {
    if (message.trim() === '') return;

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3010/v0/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        channelId: channelID,
        content: message,
      }),
    });

    if (response.ok) {
      // update the UI
      setContent([...content, {from: 'Me', message: message}]);
      setMessage('');
    }
  };
  return (
    <Box sx={{display: 'flex', height: '100vh'}}>
      {/* Chat area */}
      <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        {/* Messages */}
        <Paper sx={{flex: 1, overflow: 'auto', p: 2}}>
          <List>
            {content.map((c, index) =>{
              return (

                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>{c.from[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={c.from}
                    secondary={c.message}
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>

        {/* Input area */}
        <Box sx={{p: 2, backgroundColor: 'background.default'}}>
          <TextField
            aria-label='Input Message Here'
            fullWidth
            data-testid="message-input"
            variant="outlined"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSend}>
                  <SendIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

ChatInterface.propTypes = {
  chatData: PropTypes.object.isRequired,
  channelID: PropTypes.string.isRequired,
};

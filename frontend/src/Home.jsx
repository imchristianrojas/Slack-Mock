
import WorkspaceSelector from './WorkspaceSelector';
import ButtonBar from './ButtonBar';
import ChannelMessages from './ChannelMessages';
import {useAuth} from './Authcontext';
import {useNavigate} from 'react-router-dom';
import {Box, Container} from '@mui/material';
import {useState, useEffect} from 'react';

/** The Home Screen Component
 *
 * @return {JSX} Home Screen
 */
export default function Home() {
  const {user} = useAuth();
  const [selectedWorkspace,
    setSelectedWorkspace] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/', {replace: true});
    }
  }, [user, navigate]);

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };

  const handleBackToChannels = () => {
    setSelectedChannel(null);
  };

  return (
    <Container sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <Box>
        {selectedChannel ? (
          <ChannelMessages channel={selectedChannel}
            onBack={handleBackToChannels} />
        ) : (
          <>
            <h1>{selectedWorkspace.name}</h1>
            <WorkspaceSelector
              onWorkspaceChange={setSelectedWorkspace}
              currentWorkspace={selectedWorkspace}
              onChannelSelect={handleChannelSelect}
            />
          </>
        )}
      </Box>
      <ButtonBar />
    </Container>
  );
}

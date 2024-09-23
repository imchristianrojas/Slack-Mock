import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import {useNavigate} from 'react-router-dom';
import {useAuth} from './Authcontext';

/** Botton Button Bar Menu
 *
 * @return {JSX}
 */
export default function ButtonBar() {
  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleHome = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <ButtonGroup variant="contained" aria-label="Navigation button group">
      <Button onClick={handleHome}>Home</Button>
      <Button onClick={handleLogout}>Logout</Button>
    </ButtonGroup>
  );
}

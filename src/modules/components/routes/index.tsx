import { Box } from '@mui/system';
import Switch from '../switch';

const RouteProvider: React.FC = () => {
  return (
    <Box m="-2.5rem 0 -2.875rem -2.875rem" style={{ height: 'calc(100vh - 65px)' }}>
      <Switch />
    </Box>
  );
};

export default RouteProvider;

// mode for selecting options between "groupchat" and "direct messaging"
// operation is the corresponding subpath example for viewing group info will will route to /info
// id will correspond to the chatroom id

// definition of routes are available in route.js file inside likeminds folder

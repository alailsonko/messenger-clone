import React from 'react';
import { AuthContext } from '../../contexts/auth-context';
import { Grid, Paper, Stack, Divider, List, debounce } from '@mui/material';
import { Search } from '../../components/Search/Search';
import { BottomNavigationComponent } from '../../components/BottomNavigation/bottom-navigation';
import { ListItemComponent } from '../../components/List/list-item';
import { SocketContext } from '../../contexts/socket-context';
import { RequestContext } from '../../contexts/request-context';

export const Dashboard = () => {
  const [usersList, setUsersList] = React.useState<
    {
      avatarSrc: string;
      primaryText: string;
      secondaryText: string;
      secondaryTypography: string;
    }[]
  >([]);
  const authContext = React.useContext(AuthContext);
  const socketContext = React.useContext(SocketContext);
  const requestContext = React.useContext(RequestContext);

  const handleSearchUsers = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      const query = event.target.value;
      console.log(query);
      const { data } = await requestContext.users.usersControllerGetUsers({
        skip: 0,
        take: 10,
      });

      setUsersList(
        data.data.map((user) => ({
          avatarSrc: '/static/images/avatar/1.jpg',
          primaryText: user.email,
          secondaryText: user.username,
          secondaryTypography: user.id,
        }))
      );
    } catch (error) {
      throw error;
    }
  };

  const handleItemClick = () => {
    console.log('item clicked');
  };

  return (
    <Grid container spacing={2} height={'100vh'}>
      <Grid item xs={4}>
        <Paper>
          <Stack width={'100%'} height={'100%'}>
            <Search
              onItemClick={handleItemClick}
              onChange={debounce(handleSearchUsers, 1000)}
              list={usersList}
            />
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <ListItemComponent
                onItemClick={handleItemClick}
                avatarSrc="/static/images/avatar/1.jpg"
                primaryText="Brunch this weekend?"
                secondaryText="I'll be in your neighborhood doing errands this…"
                secondaryTypography="Ali Connors"
              />
              <Divider variant="inset" component="li" />
              <ListItemComponent
                onItemClick={handleItemClick}
                avatarSrc="/static/images/avatar/2.jpg"
                primaryText="Summer BBQ"
                secondaryText="Wish I could come, but I'm out of town this…"
                secondaryTypography="to Scott, Alex, Jennifer"
              />
              <Divider variant="inset" component="li" />
              <ListItemComponent
                onItemClick={handleItemClick}
                avatarSrc="/static/images/avatar/3.jpg"
                primaryText="Oui Oui"
                secondaryText="Do you have Paris recommendations? Have you ever…"
                secondaryTypography="Sandra Adams"
              />
            </List>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper
          sx={{
            height: '100%',
          }}
        >
          <Stack
            width={'100%'}
            height={'100%'}
            justifyContent={'space-between'}
          >
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <ListItemComponent
                onItemClick={handleItemClick}
                avatarSrc="/static/images/avatar/1.jpg"
                primaryText="Brunch this weekend?"
                secondaryText="I'll be in your neighborhood doing errands this…"
                secondaryTypography="Ali Connors"
              />
              <Divider variant="middle" component="li" />
              <ListItemComponent
                onItemClick={handleItemClick}
                avatarSrc="/static/images/avatar/2.jpg"
                primaryText="Summer BBQ"
                secondaryText="Wish I could come, but I'm out of town this…"
                secondaryTypography="to Scott, Alex, Jennifer"
              />
              <Divider variant="inset" component="li" />
              <ListItemComponent
                onItemClick={handleItemClick}
                avatarSrc="/static/images/avatar/3.jpg"
                primaryText="Oui Oui"
                secondaryText="Do you have Paris recommendations? Have you ever…"
                secondaryTypography="Sandra Adams"
              />
            </List>
            <BottomNavigationComponent
              onChatMessage={async (message) => {
                socketContext.socket.timeout(1000).emit(
                  'message',
                  {
                    chatRoomId: '123',
                    senderId: authContext.user?.id!,
                    text: message,
                    timestamp: new Date(),
                  },
                  (error, ack) => {
                    console.log('response', ack);
                  }
                );
              }}
            />
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;

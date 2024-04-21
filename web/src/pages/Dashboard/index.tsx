import React from 'react';
import { AuthContext } from '../../contexts/auth-context';
import { Grid, Paper, Stack, Divider, List, debounce } from '@mui/material';
import { Search } from '../../components/Search/Search';
import { BottomNavigationComponent } from '../../components/BottomNavigation/bottom-navigation';
import { ListItemComponent } from '../../components/List/list-item';
import { SocketContext } from '../../contexts/socket-context';
import { RequestContext } from '../../contexts/request-context';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [searchUsersList, setSearchUsersList] = React.useState<
    {
      avatarSrc: string;
      primaryText: string;
      secondaryText: string;
      secondaryTypography: string;
      id: string;
    }[]
  >([]);
  const navigate = useNavigate();
  const authContext = React.useContext(AuthContext);
  const socketContext = React.useContext(SocketContext);
  const requestContext = React.useContext(RequestContext);

  const {
    data,
    isLoading,
    refetch: refetchUserChatRooms,
  } = useQuery({
    queryKey: ['/users/{userId}/chat-rooms'],
    queryFn: async () => {
      const { data } =
        await requestContext.users.usersControllerGetUserChatRooms(
          authContext.user?.id!,
          {
            skip: 0,
            take: 10,
          }
        );

      return data.data;
    },
  });

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

      setSearchUsersList(
        data.data.map((user) => ({
          avatarSrc: process.env.REACT_APP_BACKEND_URL + '/' + user.avatar.url,
          primaryText: user.email,
          secondaryText: user.username,
          secondaryTypography: user.id,
          id: user.id,
        }))
      );
    } catch (error) {
      throw error;
    }
  };

  const handleItemClick = async (
    ev: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => {
    navigate(`/${id}`);
  };

  const handleSearchItemClick = async (
    ev: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => {
    await requestContext.users.usersControllerCreateUserChatRoom(
      authContext.user?.id!,
      {
        name: 'chat room',
        userIds: [id],
      }
    );

    refetchUserChatRooms();
  };

  return (
    <Grid container spacing={2} height={'100vh'} maxHeight={'100vh'}>
      <Grid item xs={4}>
        <Paper>
          <Stack width={'100%'} height={'100%'}>
            <Search
              onItemClick={handleSearchItemClick}
              onChange={debounce(handleSearchUsers, 1000)}
              list={searchUsersList}
            />
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {data?.map((chatRoom) => (
                <ListItemComponent
                  key={chatRoom.id}
                  id={chatRoom.id}
                  onItemClick={handleItemClick}
                  avatarSrc="/static/images/avatar/1.jpg"
                  primaryText={chatRoom.name}
                  secondaryText="I'll be in your neighborhood doing errands this…"
                  secondaryTypography="Ali Connors"
                />
              ))}
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
          <Outlet />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;

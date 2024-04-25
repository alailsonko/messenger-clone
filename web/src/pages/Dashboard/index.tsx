import React from 'react';
import { AppContext } from '../../contexts/app-context';
import { Grid, Paper, Stack, List, debounce } from '@mui/material';
import { Search } from '../../components/Search/Search';
import { ListItem } from '../../components/List/ListItem';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router-dom';
import { ChatRoomResponseObject } from '../../api/Api';

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
  const appContext = React.useContext(AppContext);

  const {
    data,
    isLoading,
    refetch: refetchUserChatRooms,
  } = useQuery({
    queryKey: ['/users/{userId}/chat-rooms'],
    queryFn: async () => {
      const { data } =
        await appContext.api.users.usersControllerGetUserChatRooms(
          appContext.user?.id!,
          {
            skip: 0,
            take: 10,
          }
        );

      return data.data as ChatRoomResponseObject[];
    },
  });

  const handleSearchUsers = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      const query = event.target.value;
      console.log(query);
      const { data } = await appContext.api.users.usersControllerGetUsers({
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
    await appContext.api.users.usersControllerCreateUserChatRoom(
      appContext.user?.id!,
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
                <ListItem
                  key={chatRoom.id}
                  id={chatRoom.id}
                  onItemClick={handleItemClick}
                  avatarSrc={
                    chatRoom.usersChatRooms.find(
                      (u) => u.user.id !== appContext.user?.id
                    )?.user.avatar.url!
                  }
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

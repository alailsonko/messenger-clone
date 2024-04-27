import React from 'react';
import { AppContext } from '../../contexts/app-context';
import { Grid, Paper, Stack, List, debounce } from '@mui/material';
import { Search } from '../../components/Search/Search';
import { ListItem } from '../../components/List/ListItem';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
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
  const { chatRoomId } = useParams<{ chatRoomId: string }>();

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
          primaryText: user.firstName + ' ' + user.lastName,
          secondaryText: user.email,
          secondaryTypography: '',
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
    const createdChatRoom =
      await appContext.api.users.usersControllerCreateUserChatRoom(
        appContext.user?.id!,
        {
          name: 'chat room',
          userIds: [id],
        }
      );
    await refetchUserChatRooms();

    navigate(`/${createdChatRoom.data.id}`);
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
                    process.env.REACT_APP_BACKEND_URL +
                    '/' +
                    chatRoom.usersChatRooms.find(
                      (u) => u.user.id !== appContext.user?.id
                    )?.user.avatar.url!
                  }
                  primaryText={
                    chatRoom.usersChatRooms.find(
                      (u) => u.user.id !== appContext.user?.id
                    )?.user.firstName! +
                    ' ' +
                    chatRoom.usersChatRooms.find(
                      (u) => u.user.id !== appContext.user?.id
                    )?.user.lastName!
                  }
                  secondaryText={
                    chatRoom.id !== chatRoomId
                      ? chatRoom.messages[0].content
                      : ''
                  }
                  secondaryTypography={
                    chatRoom.id !== chatRoomId &&
                    chatRoom.messages[0].sender?.id! === appContext.user?.id
                      ? 'You: '
                      : ''
                  }
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

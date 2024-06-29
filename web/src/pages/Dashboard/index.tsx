import React from 'react';
import { AppContext } from '../../contexts/app-context';
import { Grid, Paper, Stack, List, debounce } from '@mui/material';
import { Search } from '../../components/Search/Search';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ChatRoomResponseObject } from '../../api/Api';
import { ChatItem } from '../../components/List/ChatItem';

const Dashboard: React.FC = () => {
  const [searchUsersList, setSearchUsersList] = React.useState<
    {
      avatarSrc: string;
      fullname: string;
      message: string;
      messageFrom: string;
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
      let where:
        | {
            username?: string;
            email?: string;
            firstname?: string;
            lastname?: string;
          }
        | undefined = undefined;

      if (query) {
        const [firstname, lastname] = query.split(' ');
        where = {
          username: query,
          email: query,
          firstname,
          lastname,
        };
      }

      const { data } = await appContext.api.users.usersControllerGetUsers({
        skip: 0,
        take: 10,
        email: where?.email,
        username: where?.username,
        firstName: where?.firstname,
        lastName: where?.lastname,
      });

      setSearchUsersList(
        data.data.map((user) => ({
          avatarSrc: process.env.REACT_APP_BACKEND_URL + '/' + user.avatar.url,
          fullname: user.firstName + ' ' + user.lastName,
          message: user.email,
          messageFrom: '',
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
    const checkChatRoomExists =
      await appContext.api.users.usersControllerCheckUserChatRoomExists(
        appContext.user?.id!,
        {
          recipientIds: [id],
        }
      );

    if (checkChatRoomExists.data) {
      navigate(`/${checkChatRoomExists.data.id}`);
      return;
    }

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

  const getAvatarUrl = (chatRoom: ChatRoomResponseObject) => {
    if (!chatRoom) {
      throw new Error('chatRoom is not defined');
    }

    const loggedUser = appContext.user;

    if (!loggedUser) {
      throw new Error('user is not defined');
    }

    const isSelfChat =
      chatRoom.usersChatRooms.length === 1 &&
      chatRoom.usersChatRooms.find((u) => u.userId === loggedUser.id);

    if (isSelfChat) {
      return (
        process.env.REACT_APP_BACKEND_URL +
        '/' +
        chatRoom.usersChatRooms.find((u) => u.userId === loggedUser.id)?.user
          .avatar.url!
      );
    }

    return (
      process.env.REACT_APP_BACKEND_URL +
      '/' +
      chatRoom.usersChatRooms.find((u) => u.userId !== loggedUser.id)?.user
        .avatar.url!
    );
  };

  const getFullname = (chatRoom: ChatRoomResponseObject) => {
    if (!chatRoom) {
      throw new Error('chatRoom is not defined');
    }

    const loggedUser = appContext.user;

    if (!loggedUser) {
      throw new Error('user is not defined');
    }

    const isSelfChat =
      chatRoom.usersChatRooms.length === 1 &&
      chatRoom.usersChatRooms.find((u) => u.userId === loggedUser.id);

    if (isSelfChat) {
      return (
        chatRoom.usersChatRooms.find((u) => u.userId === loggedUser.id)?.user
          .firstName +
        ' ' +
        chatRoom.usersChatRooms.find((u) => u.userId === loggedUser.id)?.user
          .lastName
      );
    }

    return (
      chatRoom.usersChatRooms.find((u) => u.userId !== loggedUser.id)?.user
        .firstName +
      ' ' +
      chatRoom.usersChatRooms.find((u) => u.userId !== loggedUser.id)?.user
        .lastName
    );
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
                <ChatItem
                  key={chatRoom.id}
                  id={chatRoom.id}
                  onItemClick={handleItemClick}
                  avatarSrc={getAvatarUrl(chatRoom)}
                  fullname={getFullname(chatRoom)}
                  message={
                    chatRoom.id !== chatRoomId && chatRoom.messages.length
                      ? chatRoom.messages[0].content
                      : ''
                  }
                  messageFrom={
                    chatRoom.messages.length &&
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

import React from 'react';
import { AppContext } from '../../contexts/app-context';
import { Grid, Paper, Stack, List, debounce } from '@mui/material';
import { Search } from '../../components/Search/Search';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ChatRoomResponseObject } from '../../api/Api';
import { ChatItem } from '../../components/List/ChatItem';
import {
  avatarUrl,
  fullname,
  message,
  messageFrom,
} from '../../mappers/chat-room.mapper';
import { SearchUsersListType } from '../../types';
import { toSearchUsersList } from '../../mappers/search-users-list.mapper';
import { QueryKeysEnum } from '../../enums/query-keys.enum';

const Dashboard: React.FC = () => {
  const [searchUsersList, setSearchUsersList] =
    React.useState<SearchUsersListType>([]);
  const navigate = useNavigate();
  const appContext = React.useContext(AppContext);
  const { chatRoomId } = useParams<{ chatRoomId: string }>();

  const {
    data,
    isLoading,
    refetch: refetchUserChatRooms,
  } = useQuery({
    queryKey: [QueryKeysEnum.USER_CHAT_ROOMS],
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

      const [firstname, lastname] = query.split(' ');

      const { data } = await appContext.api.users.usersControllerGetUsers({
        skip: 0,
        take: 10,
        email: query,
        username: query,
        firstName: firstname,
        lastName: lastname,
      });

      setSearchUsersList(toSearchUsersList(data.data));
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
                  avatarSrc={avatarUrl(chatRoom, appContext.user!)}
                  fullname={fullname(chatRoom, appContext.user!)}
                  message={message(chatRoom, chatRoomId!)}
                  messageFrom={messageFrom(
                    chatRoom,
                    chatRoomId!,
                    appContext.user?.id!
                  )}
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

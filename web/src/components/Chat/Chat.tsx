import {
  Stack,
  List,
  ListItem as ListItemMUI,
  Card,
  ListItemText,
  Box,
} from '@mui/material';
import { SendMessage } from '../SendMessage/SendMessage';
import { ChatHead } from '../List/ChatHead';
import React, { useEffect } from 'react';
import { AppContext } from '../../contexts/app-context';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Events } from '../../ws/socket';
import LinearIndeterminate from '../Loading/LinearIndeterminate';

const Chat = () => {
  const appContext = React.useContext(AppContext);
  const messagesRef = React.useRef<HTMLUListElement>(null);
  const params = useParams<{ chatRoomId: string }>();

  const { data: chatRoomMessages } = useQuery({
    queryKey: [
      '/users/{userId}/chat-rooms/{chatRoomId}/messages',
      params.chatRoomId,
    ],
    queryFn: async () => {
      const { data } =
        await appContext.api.users.usersControllerGetChatRoomMessages(
          appContext.user?.id!,
          params.chatRoomId!,
          {
            take: 10,
            skip: 0,
          }
        );

      data.data = data.data.reverse();

      return data;
    },
  });

  const { data: chatRoom } = useQuery({
    queryKey: ['/users/{userId}/chat-rooms/{chatRoomId}', params.chatRoomId],
    queryFn: async () => {
      const { data } = await appContext.api.users.usersControllerGetChatRoom(
        appContext.user?.id!,
        params.chatRoomId!
      );

      return data;
    },
  });

  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    onSuccess(data, variables, context) {
      queryClient.setQueryData(
        ['/users/{userId}/chat-rooms/{chatRoomId}/messages', params.chatRoomId],
        (oldData: any) => ({
          ...oldData,
          data: [
            ...oldData.data,
            {
              id: 'new',
              chatRoomId: params.chatRoomId!,
              senderId: appContext.user?.id!,
              content: variables,
              timestamp: new Date(),
            },
          ],
        })
      );
    },
    mutationFn: async (message: string) => {
      appContext.socket.timeout(1000).emit(
        Events.message,
        {
          chatRoomId: params.chatRoomId!,
          senderId: appContext.user?.id!,
          content: message,
          timestamp: new Date(),
        },
        (error, ack) => {
          console.log('response', ack);
        }
      );
    },
  });

  useEffect(() => {
    appContext.socket
      .timeout(5000)
      .emit(
        Events.join,
        { chatRoomId: params.chatRoomId!, userId: appContext.user?.id! },
        (data) => {
          console.log('joined room', data);
        }
      );

    appContext.socket.on(Events.message, (message) => {
      queryClient.setQueryData(
        ['/users/{userId}/chat-rooms/{chatRoomId}/messages', params.chatRoomId],
        (oldData: any) => ({
          ...oldData,
          data: [
            ...oldData.data,
            {
              id: 'new',
              chatRoomId: params.chatRoomId!,
              senderId: message.senderId,
              content: message.content,
              timestamp: message.timestamp,
            },
          ],
        })
      );
    });

    return () => {
      appContext.socket
        .timeout(5000)
        .emit(
          Events.leave,
          { chatRoomId: params.chatRoomId!, userId: appContext.user?.id! },
          (data) => {
            console.log('left room', data);
          }
        );
      appContext.socket.off(Events.message);
    };
  }, [params.chatRoomId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  });

  const handleItemClick = (
    ev: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => {
    console.log('clicked', id);
  };

  const handleSendChatMessage = async (message: string) => {
    await sendMessageMutation.mutateAsync(message);
  };

  const getAvatarUrl = () => {
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

  const getFullname = () => {
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

  if (!chatRoom) {
    return <LinearIndeterminate />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '98vh' }}>
      <Box sx={{ display: 'flex', top: 0 }}>
        <ChatHead
          avatarSrc={getAvatarUrl()}
          fullname={getFullname()}
          status={'online'}
          id={''}
          onItemClick={handleItemClick}
        />
      </Box>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          display: 'grid',
          overflow: 'auto',
          marginTop: 'auto',
        }}
        ref={messagesRef}
      >
        {chatRoomMessages?.data.map((message) => (
          <ListItemMUI
            key={message.id}
            sx={{
              justifyContent:
                message.senderId === appContext.user?.id
                  ? 'flex-end'
                  : 'flex-start',
            }}
          >
            <Card>
              <Stack
                direction="row"
                justifyContent={
                  message.senderId === appContext.user?.id
                    ? 'flex-end'
                    : 'flex-start'
                }
                alignItems="center"
                spacing={2}
                padding={2}
              >
                <ListItemText
                  secondary={<React.Fragment>{message.content}</React.Fragment>}
                />
              </Stack>
            </Card>
          </ListItemMUI>
        ))}
      </List>
      <SendMessage onChatMessage={handleSendChatMessage} />
    </Box>
  );
};

export default Chat;

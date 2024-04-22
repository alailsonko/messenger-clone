import { Stack, List, ListItem, Card, ListItemText, Box } from '@mui/material';
import { BottomNavigationComponent } from '../BottomNavigation/bottom-navigation';
import { ListItemComponent } from '../List/list-item';
import React, { Fragment, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth-context';
import { RequestContext } from '../../contexts/request-context';
import { SocketContext } from '../../contexts/socket-context';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Events } from '../../ws/socket';

export const Chat = () => {
  const authContext = React.useContext(AuthContext);
  const socketContext = React.useContext(SocketContext);
  const requestContext = React.useContext(RequestContext);
  const messagesRef = React.useRef<HTMLUListElement>(null);
  const params = useParams<{ chatRoomId: string }>();

  const { data: chatRoomMessages } = useQuery({
    queryKey: [
      '/users/{userId}/chat-rooms/{chatRoomId}/messages',
      params.chatRoomId,
    ],
    queryFn: async () => {
      const { data } =
        await requestContext.users.usersControllerGetChatRoomMessages(
          authContext.user?.id!,
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
              senderId: authContext.user?.id!,
              content: variables,
              timestamp: new Date(),
            },
          ],
        })
      );
    },
    mutationFn: async (message: string) => {
      socketContext.socket.timeout(1000).emit(
        Events.message,
        {
          chatRoomId: params.chatRoomId!,
          senderId: authContext.user?.id!,
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
    socketContext.socket
      .timeout(5000)
      .emit(
        Events.join,
        { chatRoomId: params.chatRoomId!, userId: authContext.user?.id! },
        (data) => {
          console.log('joined room', data);
        }
      );

    socketContext.socket.on(Events.message, (message) => {
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
      socketContext.socket
        .timeout(5000)
        .emit(
          Events.leave,
          { chatRoomId: params.chatRoomId!, userId: authContext.user?.id! },
          (data) => {
            console.log('left room', data);
          }
        );
      socketContext.socket.off(Events.message);
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '98vh' }}>
      <Box sx={{ display: 'flex', top: 0 }}>
        <ListItemComponent
          avatarSrc={''}
          primaryText={'some name'}
          secondaryText={''}
          secondaryTypography={'online'}
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
          <ListItem
            key={message.id}
            sx={{
              justifyContent:
                message.senderId === authContext.user?.id
                  ? 'flex-end'
                  : 'flex-start',
            }}
          >
            <Card>
              <Stack
                direction="row"
                justifyContent={
                  message.senderId === authContext.user?.id
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
          </ListItem>
        ))}
      </List>
      <BottomNavigationComponent onChatMessage={handleSendChatMessage} />
    </Box>
  );
};

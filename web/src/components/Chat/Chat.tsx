import {
  Stack,
  List,
  Divider,
  ListItem,
  Card,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Typography,
  BottomNavigationAction,
  Box,
  TextField,
  Grid,
} from '@mui/material';
import { BottomNavigationComponent } from '../BottomNavigation/bottom-navigation';
import { ListItemComponent } from '../List/list-item';
import React, { Fragment, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth-context';
import { RequestContext } from '../../contexts/request-context';
import { SocketContext } from '../../contexts/socket-context';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export const Chat = () => {
  const authContext = React.useContext(AuthContext);
  const socketContext = React.useContext(SocketContext);
  const requestContext = React.useContext(RequestContext);
  const messagesRef = React.useRef<HTMLUListElement>(null);
  const params = useParams<{ chatRoomId: string }>();

  const { data, refetch: refetchMessages } = useQuery({
    queryKey: ['chatRoomMessages', params.chatRoomId],
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

  useEffect(() => {
    socketContext.socket
      .timeout(5000)
      .emit(
        'join',
        { chatRoomId: params.chatRoomId!, userId: authContext.user?.id! },
        (data) => {
          console.log('joined room', data);
        }
      );

    socketContext.socket.on('message', (message) => {
      refetchMessages();
    });

    return () => {
      socketContext.socket
        .timeout(5000)
        .emit(
          'leave',
          { chatRoomId: params.chatRoomId!, userId: authContext.user?.id! },
          (data) => {
            console.log('left room', data);
          }
        );
      socketContext.socket.off('message');
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
    socketContext.socket.timeout(1000).emit(
      'message',
      {
        chatRoomId: params.chatRoomId!,
        senderId: authContext.user?.id!,
        content: message,
        timestamp: new Date(),
      },
      (error, ack) => {
        refetchMessages();
        console.log('response', ack);
      }
    );
  };

  return (
    <Stack
      key={params.chatRoomId}
      width={'100%'}
      height={'100%'}
      display={'flex'}
    >
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
          marginTop: 'auto',
          overflow: 'auto',
          maxHeight: '615px',
        }}
        ref={messagesRef}
      >
        {data?.data.map((message) => (
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
    </Stack>
  );
};

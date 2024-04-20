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

export const Chat = () => {
  const authContext = React.useContext(AuthContext);
  const socketContext = React.useContext(SocketContext);
  const requestContext = React.useContext(RequestContext);
  const params = useParams<{ chatRoomId: string }>();

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
    };
  }, [params.chatRoomId]);

  const handleItemClick = (
    ev: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => {
    console.log('item clicked', id);
  };

  const handleSendChatMessage = async (message: string) => {
    socketContext.socket.timeout(1000).emit(
      'message',
      {
        chatRoomId: params.chatRoomId!,
        senderId: authContext.user?.id!,
        text: message,
        timestamp: new Date(),
      },
      (error, ack) => {
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
        }}
      >
        <ListItem
          sx={{
            justifyContent: 'flex-start',
          }}
        >
          <Card>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              padding={2}
            >
              <ListItemText
                secondary={
                  <React.Fragment>
                    {"Wish I could come, but I'm out of town this…"}
                  </React.Fragment>
                }
              />
            </Stack>
          </Card>
        </ListItem>
        <ListItem
          sx={{
            justifyContent: 'flex-end',
          }}
        >
          <Card>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              padding={2}
            >
              <ListItemText
                // primary="Summer BBQ"
                secondary={
                  <React.Fragment>
                    {"Wish I could come, but I'm out of town this…"}
                  </React.Fragment>
                }
              />
            </Stack>
          </Card>
        </ListItem>
      </List>
      <BottomNavigationComponent onChatMessage={handleSendChatMessage} />
    </Stack>
  );
};

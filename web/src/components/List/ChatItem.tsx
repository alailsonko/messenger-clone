import {
  Avatar,
  ListItem as ListItemMUI,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';

interface ChatItemProps {
  avatarSrc: string;
  fullname: string;
  message: string;
  messageFrom: string;
  id: string;
  onItemClick: (
    ev: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  avatarSrc,
  fullname,
  message,
  messageFrom,
  id,
  onItemClick,
}) => {
  return (
    <ListItemMUI
      onClick={(ev) => onItemClick(ev, id)}
      alignItems="flex-start"
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          cursor: 'pointer',
        },
      }}
    >
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={avatarSrc} />
      </ListItemAvatar>
      <ListItemText
        primary={fullname}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {messageFrom}
            </Typography>
            {message && ` — ${message}`}
          </React.Fragment>
        }
      />
    </ListItemMUI>
  );
};

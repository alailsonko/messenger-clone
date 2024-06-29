import {
  Avatar,
  ListItem as ListItemMUI,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';

interface ChatHeadProps {
  avatarSrc: string;
  fullname: string;
  status: string;
  id: string;
  onItemClick: (
    ev: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => void;
}

export const ChatHead: React.FC<ChatHeadProps> = ({
  avatarSrc,
  fullname,
  status,
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
              {status}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItemMUI>
  );
};

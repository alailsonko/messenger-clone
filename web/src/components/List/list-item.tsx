import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';

interface ListItemComponentProps {
  avatarSrc: string;
  primaryText: string;
  secondaryText: string;
  secondaryTypography: string;
  id: string;
  onItemClick: (
    ev: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => void;
}

export const ListItemComponent: React.FC<ListItemComponentProps> = ({
  avatarSrc,
  primaryText,
  secondaryText,
  secondaryTypography,
  id,
  onItemClick,
}) => {
  return (
    <ListItem
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
        primary={primaryText}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {secondaryTypography}
            </Typography>
            {` — ${secondaryText}`}
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

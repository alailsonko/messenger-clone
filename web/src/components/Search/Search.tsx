import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { ListItemComponent } from '../List/list-item';

interface ListItemComponentProps {
  avatarSrc: string;
  primaryText: string;
  secondaryText: string;
  secondaryTypography: string;
}

export const Search: React.FC<{
  list: ListItemComponentProps[];
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onItemClick: () => void;
}> = ({ list, onChange, onItemClick }) => {
  return (
    <Autocomplete
      fullWidth
      disablePortal
      id="search"
      options={list}
      sx={{ width: '100%' }}
      renderInput={(params) => (
        <TextField onChange={onChange} {...params} label="Search Users" />
      )}
      getOptionLabel={(option) => option.primaryText}
      renderOption={(props, option) => (
        <ListItemComponent
          onItemClick={onItemClick}
          key={crypto.randomUUID()}
          avatarSrc={option.avatarSrc}
          primaryText={option.primaryText}
          secondaryText={option.secondaryText}
          secondaryTypography={option.secondaryTypography}
        />
      )}
    />
  );
};

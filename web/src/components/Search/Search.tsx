import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { ListItem } from '../List/ListItem';

interface ListItemComponentProps {
  avatarSrc: string;
  primaryText: string;
  secondaryText: string;
  secondaryTypography: string;
  id: string;
}

export const Search: React.FC<{
  list: ListItemComponentProps[];
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onItemClick: (
    ev: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => void;
}> = ({ list, onChange, onItemClick }) => {
  return (
    <Autocomplete
      fullWidth
      disablePortal
      id="search"
      options={list}
      filterOptions={(options, state) => {
        return options;
      }}
      sx={{ width: '100%' }}
      renderInput={(params) => (
        <TextField onChange={onChange} {...params} label="Search Users" />
      )}
      getOptionLabel={(option) => option.primaryText}
      renderOption={(props, option) => (
        <ListItem
          id={option.id}
          onItemClick={onItemClick}
          key={option.id}
          avatarSrc={option.avatarSrc}
          primaryText={option.primaryText}
          secondaryText={option.secondaryText}
          secondaryTypography={option.secondaryTypography}
        />
      )}
    />
  );
};

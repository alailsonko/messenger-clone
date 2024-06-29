import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { ChatItem } from '../List/ChatItem';

interface ListItemComponentProps {
  avatarSrc: string;
  fullname: string;
  message: string;
  messageFrom: string;
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
      getOptionLabel={(option) => option.fullname}
      renderOption={(props, option) => (
        <ChatItem
          id={option.id}
          onItemClick={onItemClick}
          key={option.id}
          avatarSrc={option.avatarSrc}
          fullname={option.fullname}
          message={option.message}
          messageFrom={option.messageFrom}
        />
      )}
    />
  );
};

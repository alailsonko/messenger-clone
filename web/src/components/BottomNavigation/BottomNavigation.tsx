import { BottomNavigationAction, Box, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import React from 'react';

export const BottomNavigation: React.FC<{
  onChatMessage: (message: string) => void;
}> = ({ onChatMessage }) => {
  const [value, setValue] = React.useState('');

  return (
    <Box sx={{ display: 'flex', bottom: 0 }}>
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onChatMessage(value);
            setValue('');
          }
        }}
        InputProps={{
          rows: 1,
          multiline: true,
          inputComponent: 'textarea',
        }}
      />

      <BottomNavigationAction
        onClick={() => {
          onChatMessage(value);
          setValue('');
        }}
        label="Archive"
        icon={<SendIcon />}
      />
    </Box>
  );
};

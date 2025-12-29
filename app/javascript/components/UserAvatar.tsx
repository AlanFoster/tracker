import { Avatar, IconButton } from '@mui/material';
import React from 'react';

export default function ({ user, slots }) {
  slots ||= {};
  return (
    <IconButton
      size="large"
      color="inherit"
      {...slots.iconButton}
    >
      <Avatar>{(user.displayName || 'x')[0].toUpperCase()}</Avatar>
    </IconButton>
  );
}

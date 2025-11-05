import { AscentBlockChart } from '@javascript/components/AscentBlocks';
import { Form } from '@javascript/components/Inputs';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import React, { useRef, useState } from 'react';

export default function SessionCard({ session }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const formRef = useRef(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    return false;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (e) => {
    handleClose();
    formRef.current?.submit();
    e.stopPropagation();
  };
  const { form, extras } = session.deleteForm;

  return (
    <Card key={session.id} sx={{ mb: 4 }}>
      {/* Hidden form that triggers the delete */}
      <Form ref={formRef} {...form} extras={extras} data-sg-remote />
      <CardHeader
        title={session.title}
        action={(
          <IconButton aria-label="settings" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        )}
      />
      <CardActionArea href={session.detailPath} data-sg-visit>
        <CardContent sx={{ textAlign: 'center' }}>
          <AscentBlockChart ascents={session.ascents} renderLink={false} />
        </CardContent>
      </CardActionArea>
      <Menu
        id="card-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}

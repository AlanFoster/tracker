import { ascentColors } from '@javascript/components/ascentColors';
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';

interface BlockProps {
  href: string;
  color: keyof typeof ascentColors;
  title: string;
  completed: boolean;
  children: React.ReactNode;
  renderLink: boolean;
}

function titleForAscent(ascent) {
  return ascent.tries === 0
    ? 'Flashed'
    : `${ascent.tries} Attempt${ascent.tries > 1 ? 's' : ''}${ascent.completed ? '' : ' - not completed'}`;
}

export function AscentBlock({ href, color, title, completed, children, renderLink = true }: BlockProps) {
  const button = (
    <Tooltip title={title}>
      <Button
        variant="contained"
        disabled={!renderLink}
        style={{
          backgroundColor: ascentColors[color] || 'red',
          display: 'inline-block',
          textAlign: 'center',
          color: (color === 'white' || color === 'yellow') ? 'black' : 'white',
          opacity: completed ? 1 : 0.7,
        }}
      >
        {children}
      </Button>
    </Tooltip>
  );

  return (
    renderLink
      ? (
          <a href={href} data-sg-visit>
            {button}
          </a>
        )
      : button
  );
}

export function AscentListItems({ ascents, renderLink = true }) {
  return (
    <List>
      {ascents.map((ascent, index) => {
        const linkProps = renderLink
          ? {
              'component': 'a',
              'href': ascent.editPath,
              'data-sg-visit': true,
            }
          : {};
        const Item = renderLink ? ListItemButton : ListItem;
        return (
          <React.Fragment key={ascent.id}>
            <Item
              alignItems="flex-start"
              {...linkProps}
            >
              <ListItemAvatar>
                <Avatar
                  style={{
                    backgroundColor: ascentColors[ascent.color] || 'red',
                    color: (ascent.color === 'white' || ascent.color === 'yellow') ? '#4b2e0b' : 'white',
                    opacity: ascent.completed ? 1 : 0.7,
                  }}
                >
                  {index + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={titleForAscent(ascent)}
                secondary={(
                  <React.Fragment>
                    <Tooltip title={ascent.createdAt}>
                      {formatDistanceToNow(new Date(ascent.createdAt), { addSuffix: true })}
                    </Tooltip>
                  </React.Fragment>
                )}
              />
            </Item>
            {index < ascents.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        );
      },
      )}
    </List>
  );
}

export function AscentListBlocks({ ascents, href = undefined, renderLink = true }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap', // allows boxes to go to next row
        gap: 2, // spacing between boxes (theme spacing unit)
        maxWidth: { sm: '90%', md: '80%' },
        margin: '0 auto',
      }}
    >
      {ascents.map((ascent, index) => (
        <AscentBlock
          key={ascent.id}
          color={ascent.color}
          completed={ascent.completed}
          href={href || ascent.editPath}
          title={titleForAscent(ascent)}
          renderLink={renderLink}
        >
          {index + 1}
        </AscentBlock>
      ),
      )}
    </Box>
  );
}

export function AscentsOverview({ ascents, href = undefined, renderLink = true, view = 'grid' }) {
  if (ascents.length === 0) {
    return (
      <Typography mt={10} mb={10}>
        No ascents registered yet.
      </Typography>
    );
  }

  return (
    <>
      {view === 'list' && <AscentListItems ascents={ascents} renderLink={renderLink} />}
      {view === 'grid' && <AscentListBlocks ascents={ascents} href={href} renderLink={renderLink} />}
    </>
  );
}

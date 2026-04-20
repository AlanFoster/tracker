import { ascentColors } from '@javascript/applications/main/components/ascentColors';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { differenceInMinutes, format, formatDistanceToNow } from 'date-fns';
import React from 'react';

type AscentColor = keyof typeof ascentColors;

interface Ascent {
  id: string | number;
  color: AscentColor;
  completed: boolean;
  tries: number;
  createdAt: string;
  editPath: string;
  tags?: string[];
}

interface AscentListProps {
  ascents: Ascent[];
  href?: string;
  renderLink?: boolean;
}

interface AscentsOverviewProps extends AscentListProps {
  view?: 'grid' | 'list';
}

function titleForAscent(ascent: Ascent): string {
  return ascent.tries === 0
    ? 'Flashed'
    : `${ascent.tries} Attempt${ascent.tries > 1 ? 's' : ''}${ascent.completed ? '' : ' - not completed'}`;
}



export function AscentListItems({ ascents, renderLink = true }: AscentListProps) {
  return (
    <List>
      {ascents.map((ascent: Ascent, index: number) => {
        const createdAt = new Date(ascent.createdAt);
        const linkProps = renderLink
          ? {
              'component': 'a' as const,
              'href': ascent.editPath,
              'data-sg-visit': true,
            }
          : {};

        return (
          <React.Fragment key={ascent.id}>
            {renderLink ? (
              <ListItemButton
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
                        <span>
                          {differenceInMinutes(new Date(), createdAt) < 60 ? formatDistanceToNow(createdAt, { addSuffix: true }) : format(createdAt, 'yyyy/MM/dd - H:m:s')}
                        </span>
                      </Tooltip>
                      {ascent.tags && ascent.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {ascent.tags.map((tag: string) => (
                            <Chip
                              key={tag}
                              label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </React.Fragment>
                  )}
                />
              </ListItemButton>
            ) : (
              <ListItem alignItems="flex-start">
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
                        <span>
                          {differenceInMinutes(new Date(), createdAt) < 60 ? formatDistanceToNow(createdAt, { addSuffix: true }) : format(createdAt, 'yyyy/MM/dd - H:m:s')}
                        </span>
                      </Tooltip>
                      {ascent.tags && ascent.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {ascent.tags.map((tag: string) => (
                            <Chip
                              key={tag}
                              label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </React.Fragment>
                  )}
                />
              </ListItem>
            )}
            {index < ascents.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        );
      })}
    </List>
  );
}

export function AscentListBlocks({ ascents, href = undefined, renderLink = true }: AscentListProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(auto-fill, minmax(60px, 1fr))',
          sm: 'repeat(auto-fill, minmax(70px, 1fr))',
          md: 'repeat(auto-fill, minmax(80px, 1fr))',
        },
        gap: 2,
        maxWidth: { sm: '90%', md: '80%' },
        margin: '0 auto',
        p: 1,
      }}
    >
      {ascents.map((ascent: Ascent, index: number) => {
        const backgroundColor = ascentColors[ascent.color] || ascentColors.grey;
        const isLightColor = ascent.color === 'white' || ascent.color === 'yellow';
        const textColor = isLightColor ? '#2c2c2c' : 'white';
        const createdAt = new Date(ascent.createdAt);

        const cardContent = (
          <Card
            sx={{
              height: 60,
              backgroundColor: backgroundColor,
              color: textColor,
              opacity: ascent.completed ? 1 : 0.8,
              transition: 'all 0.2s ease-in-out',
              cursor: renderLink ? 'pointer' : 'default',
              position: 'relative',
              borderRadius: 2,
              boxShadow: 2,
              border: ascent.completed ? 'none' : `2px dashed ${backgroundColor}`,
              '&:hover': renderLink ? {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              } : {},
            }}
          >
            <CardContent
              sx={{
                p: 0.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                '&:last-child': { pb: 0.5 },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  opacity: 0.9,
                }}
              >
                {ascent.tries === 0 ? 'FLASH' : `${ascent.tries} ${ascent.tries === 1 ? 'TRY' : 'TRIES'}`}
              </Typography>
            </CardContent>
          </Card>
        );

        return renderLink ? (
          <Tooltip key={ascent.id} title={titleForAscent(ascent)} placement="top">
            <Box
              component="a"
              href={href || ascent.editPath}
              data-sg-visit
              sx={{ textDecoration: 'none', display: 'block' }}
            >
              {cardContent}
            </Box>
          </Tooltip>
        ) : (
          <Tooltip key={ascent.id} title={titleForAscent(ascent)} placement="top">
            {cardContent}
          </Tooltip>
        );
      })}
    </Box>
  );
}

export function AscentsOverview({ ascents, href = undefined, renderLink = true, view = 'grid' }: AscentsOverviewProps) {
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

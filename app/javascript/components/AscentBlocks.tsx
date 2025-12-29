import { ascentColors } from '@javascript/components/ascentColors';
import { Button, Typography } from '@mui/material';
import React from 'react';

interface BlockProps {
  href: string;
  color: keyof typeof ascentColors;
  title: string;
  completed: boolean;
  children: React.ReactNode;
  renderLink: boolean;
}

export function AscentBlock({ href, color, title, completed, children, renderLink = true }: BlockProps) {
  const button = (
    <Button
      title={title}
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

export function AscentBlockChart({ ascents, href = undefined, children = undefined, renderLink = true }) {
  if (ascents.length === 0) {
    return (
      <Typography mt={10} mb={10}>
        No ascents registered yet.
      </Typography>
    );
  }

  return (
    <span
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(10, max-content)',
        gap: '10px',
      }}
    >
      {children}
      {ascents.map((ascent, index) => (
        <AscentBlock
          key={ascent.id}
          color={ascent.color}
          completed={ascent.completed}
          href={href || ascent.editPath}
          title={`${(ascent.tries === 0 && ascent.completed) ? 'flash' : `${ascent.tries} attempts ${ascent.completed ? '- completed ' : '- not completed'} `} ${ascent.createdAt}`}
          renderLink={renderLink}
        >
          {index + 1}
        </AscentBlock>
      ),
      )}
    </span>
  );
}

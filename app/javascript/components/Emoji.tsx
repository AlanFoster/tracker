import React from 'react';

const colorMap = {
  orange: '🟧',
  blue: '🟦',
  white: '⬜',
  green: '🟩',
  yellow: '🟨',
  purple: '🟪',
  red: '🟥',
  brown: '🟫',
  black: '⬛',
  pink: '🩷',
};

export function colorAsEmoji(color: string): string {
  return colorMap[color] || `[${color}]`;
}

export function colorsAsEmojis(colors) {
  return colors
    .map((color, i) => {
      const separator = (i + 1) % 6 ? '' : '\n';
      return `${colorAsEmoji(color)}${separator}`;
    })
    .join('');
}

export function EmojiColor({ color }) {
  return <>{colorAsEmoji(color)}</>;
}

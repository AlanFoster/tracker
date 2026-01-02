const colorMap = {
  completed: {
    orange: '🟧',
    blue: '🟦',
    white: '⬜',
    green: '🟩',
    yellow: '🟨',
    purple: '🟪',
    red: '🟥',
    brown: '🟫',
    black: '⬛',
    pink: '💖',
  },
  notCompleted: {
    orange: '🟠',
    blue: '🔵',
    white: '⚪',
    green: '🟢',
    yellow: '🟡',
    purple: '🟣',
    red: '🔴',
    brown: '🟤',
    black: '⚫',
    pink: '🩷',
  },
};

export function ascentAsEmoji(ascent): string {
  const { color, completed } = ascent;
  const emojis = colorMap[completed ? 'completed' : 'notCompleted'];
  return emojis[color] || `[${color}]`;
}

export function ascentsAsEmojis(ascents) {
  return ascents
    .map((ascent, i) => {
      const separator = (i + 1) % 6 ? '' : '\n';
      return `${ascentAsEmoji(ascent)}${separator}`;
    })
    .join('');
}

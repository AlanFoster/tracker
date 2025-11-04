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
    pink: '🩷'
}

export const colorAsEmoji = (color: string): string => {
    return colorMap[color] || `[${color}]`;
}

export const colorsAsEmojis = (colors) => {
    return colors.map((color, i) => {
        let separator = (i + 1) % 6 ? '' : '\n'
        return `${colorAsEmoji(color)}${separator}`
    }).join("");
}

export const EmojiColor = ({color}) => {
    return <>{colorAsEmoji(color)}</>
}

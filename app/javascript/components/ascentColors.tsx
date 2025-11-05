import {deepOrange, blue, green, amber, deepPurple, red, pink, grey} from '@mui/material/colors';
import {createTheme} from "@mui/material";

const base = 600;

export const ascentColors = {
    orange: deepOrange[base],
    blue: blue[base],
    white: grey[300],
    green: green[base],
    yellow: amber[base],
    purple: deepPurple[base],
    red: red[base],
    black: grey[900],
    pink: pink[base],
    grey: grey[base]
}

export const ascentTheme = createTheme({
    palette: {
        orange: {
            main: deepOrange[500],
            light: deepOrange[300],
            dark: deepOrange[700],
            contrastText: '#fff',
        },
        blue: {
            main: blue[500],
            light: blue[300],
            dark: blue[700],
            contrastText: '#fff',
        },
        white: {
            main: grey[50],
            light: '#ffffff',
            dark: grey[200],
            contrastText: grey[900],
        },
        green: {
            main: green[500],
            light: green[300],
            dark: green[700],
            contrastText: '#fff',
        },
        yellow: {
            main: amber[500],
            light: amber[300],
            dark: amber[700],
            contrastText: grey[900],
        },
        purple: {
            main: deepPurple[500],
            light: deepPurple[300],
            dark: deepPurple[700],
            contrastText: '#fff',
        },
        red: {
            main: red[500],
            light: red[300],
            dark: red[700],
            contrastText: '#fff',
        },
        black: {
            main: grey[900],
            light: grey[700],
            dark: grey[900],
            contrastText: '#fff',
        },
        pink: {
            main: pink[500],
            light: pink[300],
            dark: pink[700],
            contrastText: '#fff',
        },
    },
});

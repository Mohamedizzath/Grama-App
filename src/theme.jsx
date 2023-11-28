// Contains the customize theme 

import { extendTheme } from "@mui/joy";

const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                main: {
                    50: '#FFF0E6',
                    100: '#FFA467',
                    200: '#FF954E',
                    300: '#FF761B',
                    400: '#FF6F0F',
                    500: '#F26202',
                    600: '#E65D02',
                    700: '#D95802',
                    800: '#CC5202',
                    900: '#BF4D02',
                }
            }
        }
    },
    fontFamily: {
        display: '"Roboto Condensed", var(--joy-fontFamily-fallback)',
        body: '"Inter", var(--joy-fontFamily-fallback)'
    }
});

export default theme;
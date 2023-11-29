// Contains the customize theme 

import { extendTheme } from "@mui/joy";

const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                main: {
                    50: '#FFF0E6',
                    100: '#FDCCAB',
                    200: '#FFD7BC',
                    300: '#FF761B',
                    400: '#FF6F0F',
                    500: '#F26202',
                    600: '#E65D02',
                    700: '#D95802',
                    800: '#CC5202',
                    900: '#BF4D02',
                    plainColor:"#F26202",
                    plainHoverBg: "#FDCCAB",
                    plainActiveBg: "#FFD7BC",
                    plainDisabledColor: "#F0F4F8",
                    outlinedColor: "#F26202",
                    outlinedBorder: "#FF761B",
                    outlinedHoverBg: "#FDCCAB",
                    outlinedActiveBg: "#FFD7BC",
                    outlinedDisabledColor: "#9FA6AD",
                    outlinedDisabledBorder: "#DDE7EE",
                    softColor: "#D95802",
                    softBg: "#FFF0E6",
                    softHoverBg: "#FFD7BC",
                    softActiveColor: "#FFF",
                    softActiveBg: "#FF761B",
                    softDisabledColor: "#9FA6AD",
                    softDisabledBg:"#FBFCFE",
                    solidColor: "#FFF",
                    solidBg: "#F26202",
                    solidHoverBg: "#E65D02",
                    solidActiveBg: "#D95802",
                    solidDisabledColor: "#9FA6AD",
                    solidDisabledBg: "#F0F4F8",
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
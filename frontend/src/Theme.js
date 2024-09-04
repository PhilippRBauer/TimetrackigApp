import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core/';

const Theme = createMuiTheme({
  palette: {
    primary: {
      contrastText: '#fff',
      dark: '#004d40',
      main: '#00897b',
      light: '#b2dfdb'
    },
    secondary: {
      contrastText: '#fff',
      dark: '#004d40',
      main:'#26a69a',
      light: '#26a69a'
    },
    error: {
      main: colors.red[400],
    },
    text: {
      primary: colors.blueGrey[800],
      secondary: colors.blueGrey[600],
      link: '#004d40'
    },
    background: {
      default: '#F4F6F8',
      paper: '#fff'
    },
    icon: '#00695c',
    divider: colors.grey[200]
  },
});


export default Theme;
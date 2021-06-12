import { Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
      color: 'white'
    },
  }));

export default function Footer() {
    const classes = useStyles();

    return <footer>

        <Typography className={classes.title} variant="h6">
            Footer
          </Typography>

    </footer>
}


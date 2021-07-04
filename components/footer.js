import logo from '../public/logo.png'
import Image from 'next/image'
import styles from '../styles/Footer.module.css'


import Container from "@material-ui/core/Container";

import Typography from "@material-ui/core/Typography";
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


const QUOTES = [
"To be or not to be,that is the question”- Hamlet, William Shakespeare",
"It is a far, far better thing that I do, than I have ever done; it is a far, far better rest I go to than I have ever known.” -A Tale of Two Cities, Charles Dickens",
"It matters not what someone is born, but what they grow to be.” -Harry Potter and the goblet of fire by JK Rowling",
"Be yourself and people will like you. —Diary of aWimpy Kid by Jeff Kinney",
"The moment you doubt whether you can fly, you cease forever to be able to do it.” —Peter Pan by J.M. Barrie",
"And, now that you don’t have to be perfect you can be good.”—East of Eden by John Steinbeck",
"Even the darkest night will end and the sun will rise.— Les Misérables by Victor Hugo",
"‘What day is it?’, asked Winnie the Pooh. ‘It’s today,’ squeaked Piglet. ‘favorite day,’ said Pooh.” —The Adventures of Winniethe Pooh by A. A. Milne",
"I am not afraid of storms, for I am learning howto sail my ship. —Little Woman by Louisa May Alcott",
"It's the job that's never started as takes longest to finish. -JRR Tolkien"
]

export default function Footer() {
    const classes = useStyles();

    const index =  Math.floor(new Date().getTime()/8.64e7) % 10
   

    return <footer id={styles.footer}>
      <Container maxWidth="md">

  <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
      <Image loader={({src}) => src} width={75} height={75} layout="fixed" src={logo} />
      <Typography className={styles.description} style={{width: 'calc(100% - 75px)', paddingLeft: '20px'}} display="inline">
        Contact us admin@overbooked.in
      </Typography>
    </div>

      <Typography className={classes.title} variant="h6">
          Welcome to OverBooked! Explore a fun and simple way to give away or find books for free. 
      </Typography>

      <Typography className={styles.quote}>
          {QUOTES[index]}
      </Typography>

    </Container>
    </footer>
}


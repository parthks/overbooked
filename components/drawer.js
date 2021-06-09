import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';

import Link from 'next/link'
import firebase from '../lib/firebase'

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function TemporaryDrawer({openState, toggleDrawer, authUser}) {
  const classes = useStyles();
//   const [openState, setOpenState] = React.useState(false);

//   const toggleDrawer = (open) => (event) => {
//     if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
//       return;
//     }

//     setOpenState(open);
//   };


let selectedPath = null
if (typeof window !== "undefined") {
  selectedPath = window.location.pathname
}


  return (
    <div>
      
        <React.Fragment>
          {/* <Button onClick={toggleDrawer(true)}>{anchor}</Button> */}
          <Drawer anchor={"left"} open={openState} onClose={() => toggleDrawer(false)}>
            <div
                className={clsx(classes.list)}
                role="presentation"
                onClick={() => toggleDrawer(false)}
                onKeyDown={() => toggleDrawer(false)}
                >
                <List>
                    <Link href="/"><ListItem selected={selectedPath === "/"} button>
                        <ListItemIcon>{<LocalLibraryIcon />}</ListItemIcon>
                        <ListItemText primary={"Home"} />
                    </ListItem></Link>
                </List>
                <Divider />
                <List>
                    <Link href="/add"><ListItem selected={selectedPath === "/add"} button>
                        <ListItemIcon>{<LocalLibraryIcon />}</ListItemIcon>
                        <ListItemText primary={"Add a Book"} />
                    </ListItem></Link>
                </List>
                {/* <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                    ))}
                </List> */}
                {authUser ? <>
                  <Divider />
                  <List onClick={() => firebase.auth().signOut()}>
                    <ListItem button>
                        <ListItemIcon>{<LocalLibraryIcon />}</ListItemIcon>
                        <ListItemText primary={"Logout"} />
                    </ListItem>
                </List>
                </> : ''}
            </div>
          </Drawer>
        </React.Fragment>
      
    </div>
  );
}
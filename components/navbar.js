import React, {useState, useEffect} from 'react';
import firebase from '../lib/firebase'
import {client} from '../lib/graphql/client'
import {QUERY_USER} from '../lib/graphql/user'

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import SideDrawer from './drawer'
import Link from 'next/link'

import SignInScreen from './signInPopup'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: 'white'
  },
}));

export default function NavBarAppBar() {
  const classes = useStyles();
  const [openState, setOpenState] = React.useState(false);

  const [loginVisible, setLoginVisible] = useState(false)
  const [authUser, setAuthUser] = useState(false)
  const [userData, setUserData] = useState(false)
  

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      setAuthUser(user);
      if (user) {
        const {data: {Users_by_pk: userData}} = await client.query({query: QUERY_USER, variables: {uid: user.uid}})
        console.log(userData)
        setUserData(userData)
        
        console.log({user})
      }
      
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  
  if (userData === null || userData.new_user) {
    if (window.location.pathname != "/new-user") window.location.href = "/new-user"
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={() => setOpenState(!openState)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Link href="/"><Typography variant="h6" className={classes.title}>
            Overbooked
          </Typography></Link>

          {authUser === false || authUser ? '' : <Button onClick={() => setLoginVisible(true)} color="inherit">Login</Button>}

        </Toolbar>
      </AppBar>

      <SignInScreen onClose={() => setLoginVisible(false)} visible={loginVisible} />

      <SideDrawer userData={userData} authUser={authUser} openState={openState} toggleDrawer={setOpenState} />
    </div>
  );
}
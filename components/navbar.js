import React, {useState, useEffect} from 'react';
import firebase from '../lib/firebase'
import {client} from '../lib/graphql/client'
import {QUERY_USER} from '../lib/graphql/user'

import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../lib/redux/slices/user'


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

import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

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
  // const [userData, setUserData] = useState(false)
  const userData = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()


  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      setAuthUser(user);
      if (user) {
        const {data: {Users_by_pk: userData}} = await client.query({query: QUERY_USER, variables: {uid: user.uid}})
        // console.log(userData)
        // console.log("SENDING ACTION", userData)
        dispatch(updateUser(userData))
        if (userData === null || userData.new_user) {
          if (window.location.pathname != "/new-user") window.location.href = "/new-user"
        }
        // setUserData(userData)
        
        // console.log({user})
      }
      
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  // console.log("userData", userData)

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>

          {authUser ? <IconButton onClick={() => setOpenState(!openState)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> : ''}

          <Link href="/"><Typography variant="h6" className={classes.title}>
            Overbooked
          </Typography></Link>

          {authUser ? <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton> : <Button onClick={() => setLoginVisible(true)} color="inherit">Login</Button>}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={menuOpen}
            onClose={handleClose}
          >
            <Link href="/account/profile"><MenuItem onClick={handleClose}>Profile</MenuItem></Link>
            <Link href="/account/books"><MenuItem onClick={handleClose}>My Books</MenuItem></Link>
            <Link href="/account/interests"><MenuItem onClick={handleClose}>My Interests</MenuItem></Link>
          </Menu>

        </Toolbar>
      </AppBar>

      <SignInScreen onClose={() => setLoginVisible(false)} visible={loginVisible} />

      {authUser ? <SideDrawer userData={userData} authUser={authUser} openState={openState} toggleDrawer={setOpenState} /> : ''}
    </div>
  );
}
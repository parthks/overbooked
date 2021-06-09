// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../lib/firebase';

import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: '100%',
      maxWidth: 350,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
    },
    body: {
        padding: theme.spacing(2, 4, 0),
    }
  }));


// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    {provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID, defaultCountry: 'IN'},
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function SignInScreen({visible=true, onClose}) {
    const classes = useStyles();
  const [isSignedIn, setIsSignedIn] = useState(null); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);



  if (isSignedIn === null) {return null}

  if (!isSignedIn) {
    return (
        <Modal
    open={visible}
    onClose={() => {}}
    aria-labelledby="login"
    aria-describedby="login"
    >
    <div style={{
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
  }} className={classes.paper}>
    <div className={classes.body}>
        <div style={{display: 'flex', justifyContent: 'space-between',     alignItems: 'center'}}>
        <h1>Overbooked</h1>
        <IconButton onClick={() => {
            if (onClose) {onClose()}
            else {
                window.location.href="/"
            }
        }}><CloseIcon /></IconButton>
        
        </div>

        <p>Please sign-in:</p>
    </div>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
    </Modal>

      
    );
  }
  return null;
}

export default SignInScreen;
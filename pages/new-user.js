
import React, {useState, useEffect} from 'react';
import {client} from '../lib/graphql/client'
import firebase from '../lib/firebase'
import {INSERT_USER, QUERY_USER, UPDATE_USER} from '../lib/graphql/user'
import { useQuery } from '@apollo/client';

import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../lib/redux/slices/user'


import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import NewUserOnboardingStepper from '../components/NewUserOnboarding'
import { Button } from '@material-ui/core';

import { message } from 'antd';


export default function NewUserRegistration() {
    const [loggedIn, setLoggedIn] = useState(null)

    const dispatch = useDispatch()

    // const [userData, setUserData] = useState(null)
    const { loading, error, data, refetch } = useQuery(QUERY_USER, {
        variables: { uid: loggedIn ? loggedIn.uid : null },
        onCompleted: (data) => {
            console.log("QUERY COMPLETE", data)
            if (data.Users_by_pk?.new_user === false) window.location.href = "/"
        }
    });

    
    const userData = data ? data.Users_by_pk : null
    console.log(userData)


    const [getStarted, setGetStarted] = useState(false)
    const [activeStep, setActiveStep] = useState(0)

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            setLoggedIn(user)  
            // const {data: {Users_by_pk: userDatum}} = await client.query({query: QUERY_USER, variables: {uid: user.uid}})         
            // setUserData(userDatum)
        } else {
            setLoggedIn(false)
        }
        
        });
        return () => unregisterAuthObserver(); 
    }, []);

    const validateFields = (data) => {
        if (activeStep === 0) {
            if (!data.name || !data.phone_number || !data.email) {
                message.error("All fields are required")
                return false
            }
        } else if (activeStep === 1) {
            if (!data.location || !data.location_query) {
                message.error("An approximate location is required")
                return false
            }
        } else if (activeStep === 2) {
            if (!data.notification_email && !data.notification_phone) {
                message.error("At least one notification method is required")
                return false
            }
        }

        return true
    } 

    const handleNext = async (data) => {
        if (!validateFields(data)) {return}
        await client.mutate({mutation: UPDATE_USER, variables: {uid: loggedIn.uid, data}  })
        refetch()
        dispatch(updateUser(data))

        if (activeStep === 2) {
            // finish
            await client.mutate({mutation: UPDATE_USER, variables: {uid: loggedIn.uid, data: {new_user: false}}  })
            window.location.href = "/"
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        
        
    };
    const handleBack = async (data) => {
        if (activeStep === 0) {
            setGetStarted(false)
        } else {
            await client.mutate({mutation: UPDATE_USER, variables: {uid: loggedIn.uid, data} })
            refetch()
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
        
    };

    const onboardNow = async () => {
        console.log(loggedIn)
        const data = {uid: loggedIn.uid}
        if (loggedIn.phoneNumber) {
            data["phone_number"] = loggedIn.phoneNumber
        }
        if (loggedIn.email) {
            data["email"] = loggedIn.email
        }
        if (loggedIn.displayName) {
            data["name"] = loggedIn.displayName
        }
        await client.mutate({mutation: INSERT_USER, variables: data})
        await refetch()
        setGetStarted(true)
    };
    

  

    return (
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h6">Welcome to Overbooked</Typography>
        </Box>

        {!getStarted ? 
        <div>
        <Typography>Some message welcoming and explaining Overbooked to the new user</Typography>

        {loggedIn === null ? '' : 
        loggedIn ? 
        <div style={{textAlign: 'center', marginTop: '50px'}}>
        <Button variant="contained" color="primary" onClick={() => onboardNow()}>Get Started</Button>
        </div> : 
        <div style={{textAlign: 'center', marginTop: '50px'}}>
        <Button variant="contained" color="primary" onClick={() => {}}>Create An Account</Button>
        </div>
        }

        </div> 
        
        :

        <NewUserOnboardingStepper userData={userData} 
        activeStep={activeStep} handleBack={handleBack} handleNext={handleNext} />

        }

      </Container>
    );
    
  }
  
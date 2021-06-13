import React, {useState, useEffect} from 'react'
import {QUERY_USER, UPDATE_USER} from '../../lib/graphql/user'
import { useQuery, useMutation } from '@apollo/client';

import {useAuthUserState} from '../../lib/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../../lib/redux/slices/user'


import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Button from '@material-ui/core/Button';
import TextField  from '@material-ui/core/TextField';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// import { Input } from 'antd';

// const { Search } = Input;


import dynamic from 'next/dynamic'
// import { notification } from 'antd';
import { Input, message, notification } from 'antd';

const { Search } = Input;
const API = "https://nominatim.openstreetmap.org/search?format=json&q="



import SignInScreen from '../../components/signInPopup'
import { CircularProgress } from '@material-ui/core';


export default function Profile() {

    const authUser = useAuthUserState()

    const { loading, error, data, refetch } = useQuery(QUERY_USER, {
        variables: { uid: authUser?.uid },
    });
    const dispatch = useDispatch()

    const [userData, setUserData] = useState(null)

    const [searchLoading, setSearchLoading] = useState(false)
    const [prevSearchQuery, setPrevSearchQuery] = useState(null)

    useEffect(() => {
        const newData = data ? data.Users_by_pk : null
        if (newData) delete newData._typename
        setUserData(newData)
    }, [data])

    const [updateUserData, {loading: mutationLoading}] = useMutation(UPDATE_USER, {variables: {
        uid: authUser?.uid, data: userData
    }, 
    onCompleted: () => {message.success("Profile updated successfully"); refetch(); dispatch(updateUser(userData))}, 
    onError: (err) => message.error(err.message)
    })


    const Map = React.useMemo(() => dynamic(
        () => import('../../components/Map'), // replace '@components/map' with your component's location
        { 
          loading: () => <p>A map is loading</p>,
          ssr: false // This line is important. It's what prevents server-side render
        }
      ), [/* list variables which should trigger a re-render here */])
    

    const validateFields = (data) => {

        if (!data.name || !data.phone_number || !data.email) {
            message.error("All Basic Information is required")
            return false
        }
        if (!data.location || !data.location_query) {
            message.error("An approximate location is required")
            return false
        }
        if (!data.notification_email && !data.notification_phone) {
            message.error("At least one notification method is required")
            return false
        }

        return true
    } 

    

    const searchLocation = async (searchQuery) => {
        // const searchQuery = userData.location_query
        if (!searchQuery) {
            setUserData({...userData, location: null})
            setPrevSearchQuery(null)
            return
        }

        if (prevSearchQuery === searchQuery) {return}

        setSearchLoading(true)
        
        try {
            const res = await fetch(API+searchQuery)
            const data = await res.json()
            if (data && data.length) {
                setPrevSearchQuery(searchQuery)
                const coordinates = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
                const location = {
                    "type": "Point",
                    coordinates
                }
                setUserData({...userData, location})
            }
            console.log(data.lat, data.lon, data[0])

        } catch (e) {
            message.error(e.message)
        } finally {
            setSearchLoading(false)
        }
    }
    
    // const userData = data ? data.Users_by_pk : null
    console.log(userData)


    console.log(loading, error, data)

    return <> <Container maxWidth="sm">
    <SignInScreen />

    <Box my={4}>
        <Typography>My Profile</Typography>
    </Box>

    <Typography style={{ fontWeight: 'bold' }}>Basic Information</Typography>

    <TextField 
    value={userData?.name ? userData?.name : ''}
    label="Name"
    onChange={e => setUserData({...userData, name: e.target.value})}
    fullWidth /><br /><br />

    <TextField 
    value={userData?.phone_number ? userData?.phone_number : ''}
    label="Phone Number"
    onChange={e => setUserData({...userData, phone_number: e.target.value})}
    fullWidth /><br /><br />

    <TextField 
    value={userData?.email ? userData?.email : ''}
    label="Email ID"
    helperText="We will use this Email ID to send notifications of any interests received on your books"
    onChange={e => setUserData({...userData, email: e.target.value})}
    fullWidth /><br /><br /><br />


    <Typography style={{ fontWeight: 'bold' }}>Location Details</Typography>

    <Search value={userData?.location_query ? userData?.location_query : ''} 
    onChange={(e) => setUserData({...userData, location_query: e.target.value})}
    onSearch={(value) => {
        setUserData({...userData, location_query: value})
        searchLocation(value)
    }} 
    placeholder="Search landmark, pincode, city..." 
    enterButton="Search" loading={searchLoading} />
    
    <br /><br />
    <Map coordinates={userData?.location?.coordinates ? userData?.location?.coordinates : null} />

    <br /><br /><br />

    <Typography style={{ fontWeight: 'bold' }}>Notifications</Typography>

    <Typography>Choose your preferred contact methods you would like to share with owner's of books you are interested in: </Typography>
            
        <FormControlLabel
            control={
            <Checkbox
                checked={!!userData?.notification_email}
                onChange={e => setUserData({...userData, notification_email: e.target.checked})}
                name="checkedB"
                color="primary"
            />
            }
            label="Email"
        /><br />
        <FormControlLabel
            control={
            <Checkbox
                checked={!!userData?.notification_phone}
                onChange={e => setUserData({...userData, notification_phone: e.target.checked})}
                name="checkedB"
                color="primary"
            />
            }
            label="Phone Number"
        />

    <br /><br />

    <div style={{textAlign: 'center'}}>

    {mutationLoading ? <CircularProgress /> : 
    <Button disabled={!authUser?.uid} onClick={() => {
        if (validateFields(userData)) updateUserData()
    }} color="primary" variant="contained" fullWidth>Save</Button>}

    </div>
    

    </Container>
    </>

}
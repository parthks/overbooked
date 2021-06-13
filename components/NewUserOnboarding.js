
import React, {useState, useCallback, useEffect} from 'react';
import debounce from "lodash.debounce";
const API = "https://nominatim.openstreetmap.org/search?format=json&q="


import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField  from '@material-ui/core/TextField';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// import { Input } from 'antd';

// const { Search } = Input;


import dynamic from 'next/dynamic'
// import { notification } from 'antd';
import { Input, notification } from 'antd';

const { Search } = Input;



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Basic Information', 'Location Details', 'Notifications'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Please fill in some basic information about yourself';
    case 1:
      return 'An approximate location will help give you better results';
    case 2:
      return 'You will receive Notifications by email regarding interests in the books you upload';
    default:
      return 'Unknown stepIndex';
  }
}

export default function HorizontalLabelPositionBelowStepper({activeStep, handleNext, handleBack, userData}) {
  const classes = useStyles();

  const [name, setName] = useState(userData ? userData.name : null)
  const [phone_number, setPhone] = useState(userData ? userData.phone_number : null)
  const [email, setEmail] = useState(userData ? userData.email : null)


//   const [pincode, setPincode] = useState(userData ? userData.pincode : null)

    const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(userData ? userData.location_query : null)
  const [coordinates, setCoordinates] = useState(userData ? userData.location ? userData.location.coordinates : null : null)



  const [notification_email, setNotificationEmail] = useState(userData ? userData.notification_email : true)
  const [notification_phone, setNotificationPhone] = useState(userData ? userData.notification_phone : true)

  const steps = getSteps();



  useEffect(async () => {

    if (!searchQuery) {
        setCoordinates(null)
        return
    }

    setSearchLoading(true)

    const res = await fetch(API+searchQuery)

    const data = await res.json()

    if (data && data.length) {
      setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)])
    }
    console.log(data.lat, data.lon, data[0])

    setSearchLoading(false)

  }, [searchQuery])




  const Map = React.useMemo(() => dynamic(
    () => import('./Map'), // replace '@components/map' with your component's location
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false // This line is important. It's what prevents server-side render
    }
  ), [/* list variables which should trigger a re-render here */])



  return (
    <div className={classes.root}>
      <Stepper style={{padding: 0}} activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        
        <br />
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>


            {activeStep === 0 ? 
            <>
            <TextField 
            value={name ? name : ''}
            label="Name"
            onChange={e => setName(e.target.value)}
            fullWidth /><br /><br />
            <TextField 
            value={phone_number ? phone_number : ''}
            label="Phone Number"
            onChange={e => setPhone(e.target.value)}
            fullWidth /><br /><br />
            <TextField 
            value={email ? email : ''}
            label="Email ID"
            helperText="We will use this Email ID to send notifications of any interests received on your books"
            onChange={e => setEmail(e.target.value)}
            fullWidth /><br /><br />
            </>
            : activeStep === 1 ?
            <>
            {/* <TextField 
            value={pincode ? pincode : ''}
            label="Pincode"
            type="numeric"
            // inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={e => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
            fullWidth /> */}
            <Search defaultValue={searchQuery} 
            onSearch={(value) => {
                setSearchQuery(value)
            }} 
            placeholder="Search landmark, pincode, city..." 
            enterButton="Search" loading={searchLoading} />
            
            <br /><br />
            <Map coordinates={coordinates} />
            </>
            : activeStep === 2 ? 
            <>
            <br />
            <Typography>Choose your preferred contact methods you would like to share with owner's of books you are interested in: </Typography>
            
            <FormControlLabel
                control={
                <Checkbox
                    checked={notification_email}
                    onChange={e => setNotificationEmail(e.target.checked)}
                    name="checkedB"
                    color="primary"
                />
                }
                label="Email"
            /><br />
            <FormControlLabel
                control={
                <Checkbox
                    checked={notification_phone}
                    onChange={e => setNotificationPhone(e.target.checked)}
                    name="checkedB"
                    color="primary"
                />
                }
                label="Phone Number"
            />
            </> : null}



            <div style={{marginTop: '20px'}}>
              <Button
                // disabled={activeStep === 0}
                onClick={() => handleBack({
                    email,
                    phone_number,
                    name,
                    location: coordinates ? {
                        "type": "Point",
                        coordinates
                    } : null,
                    location_query: searchQuery,
                    notification_email,
                    notification_phone
                })}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={() => handleNext({
                    email,
                    phone_number,
                    name,
                    location_query: searchQuery,
                    location: coordinates ? {
                        "type": "Point",
                        coordinates
                    } : null,
                    notification_email,
                    notification_phone
                })}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        
      </div>
    </div>
  );
}



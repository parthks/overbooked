import {QUERY_USER} from '../../lib/graphql/user'
import { useQuery } from '@apollo/client';

import {useAuthUserState} from '../../lib/firebase'

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import SignInScreen from '../../components/signInPopup'


export default function Profile() {

    const authUser = useAuthUserState()

    const { loading, error, data } = useQuery(QUERY_USER, {
        variables: { uid: authUser?.uid },
    });

    console.log(loading, error, data)

    return <> <Container maxWidth="sm">
    <SignInScreen />

    <Box my={4}>
        <Typography>My Profile</Typography>
    </Box>

    </Container>
    </>

}

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import SignInScreen from '../../components/signInPopup'

export default function MyInterests() {
    return <> <Container maxWidth="sm">
    <SignInScreen />

    <Box my={4}>
        <Typography>Interested Books</Typography>
    </Box>

    </Container>
    </>
}
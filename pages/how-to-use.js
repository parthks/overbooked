
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Image from 'next/image'
import login from '../public/login.png'
import lines from '../public/3lines.png'
import addabook from '../public/addabook.png'
import addbooksnow from '../public/addbooksnow.png'
import qrcode from '../public/qrcode.png'
import interested from '../public/interested.png'
import seeallbooks from '../public/seeallbooks.png'


export default function HowItWorks() {
    return <Container maxWidth="sm">
        
        <Typography variant="h3">How To Use Overbooked</Typography><br />

        <Typography>
        Please LOGIN in the top right corner to use the website properly <span style={{position: 'relative', top: '10px'}} ><Image loader={({src}) => src} src={login} width={43.75} height={35} layout="fixed" /></span>
        </Typography>
        
        <br />
        <Typography variant="h4">HOW TO UPLOAD BOOKS ON OVERBOOKED</Typography><br />


        <br />

        <Typography>
        Step 1: Click on the three lines <span style={{position: 'relative', top: '10px'}} ><Image loader={({src}) => src} src={lines} width={43.75} height={35} layout="fixed" /></span> in the top left corner and then click Add a Book. <span style={{position: 'relative', top: '10px'}} ><Image loader={({src}) => src} src={addabook} width={140} height={45} layout="fixed" /></span>
        </Typography>

        <br />
        <Typography>
        You can also use the Add Books Now button on the home page <span style={{position: 'relative', top: '10px'}} ><Image loader={({src}) => src} src={addbooksnow} width={140} height={35} layout="fixed" /></span>
        </Typography>

        <br />
        <Typography>
        Step 2: There are two methods to upload books on the site...
        </Typography>
        <Typography>
        Method 1) Fill in book details manually by uploading a book picture, adding the name, adding the author, and then check either the fiction or non-fiction circle.
        </Typography>
        <Typography>
        Method 2) Use the ISBN to autofill all details and then check either the fiction or non-fiction circle. The ISBN of a book is the number on the book back of the book, usually starting with 978 and is next to the barcode. It is mostly in the bottom right corner. <span style={{position: 'relative', top: '10px'}} ><Image loader={({src}) => src} src={qrcode} width={75} height={75} layout="fixed" /></span>
        </Typography>

        <br />
        <Typography>
        After clicking submit once all details are filled through either method, your book will be moderated and then will be on the site in less than 24 hours. 
        </Typography>
        <br />
        <Typography>
        If you have any problems uploading books, please email <a target="_blank" href="mailto:admin@overbooked.in">admin@overbooked.in</a> for help.
        </Typography>



        <br />
        <Typography variant="h4">HOW TO REQUEST BOOKS ON OVERBOOKED</Typography><br />

        <Typography>
        Step 1) Search for any books you'd like or click the 'See all Books' button at the bottom of the home page to navigate through all the books and find one you like <span style={{position: 'relative', top: '10px'}} ><Image loader={({src}) => src} src={seeallbooks} width={140} height={35} layout="fixed" /></span>
        </Typography>
        <br />
        <Typography>
        Step 2) Once you have found a book you like, click on interested. This button should be above the book on the right side<span style={{position: 'relative', top: '10px'}} ><Image loader={({src}) => src} src={interested} width={140} height={55} layout="fixed" /></span>
        </Typography>
        <br />
        <Typography>
        Step 3) The owner of the book will get an email about your request and if they choose to approve it, both people will get an email with the contact details of the other person. You’ll can now get in contact and choose how to give the book
        </Typography>
        <br />
        



       
    </Container>
}
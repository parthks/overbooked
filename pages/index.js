import styles from '../styles/Home.module.css'

import logo from '../public/logo.png'
import Image from 'next/image'
import NextLink from 'next/link'

import { useRouter } from 'next/router'
import {QUERY_RECENT_BOOKS} from '../lib/graphql/books'
import adminClient from '../lib/graphql/admin'

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

import { Input } from 'antd';
import { Typography } from '@material-ui/core';

import BookTile from '../components/BookTile'


const { Search } = Input;



export default function Home({books}) {
  const router = useRouter()


  const onSearch = (value) => {
    console.log({value})
    router.push("/search?q="+value)
    // alert(value)
  }
  
  return (<>
    <Container maxWidth="sm">
      <Box textAlign="center" my={4}>
        <Image loader={({src}) => src} src={logo} width={376} height={300} />
        <br /><br />
        <Search 
        onSearch={onSearch} 
        allowClear 
        placeholder="Search by title or author" enterButton="Search" size="large" 
        onPressEnter={(e) => onSearch(e.target.value)} />
        <br /><br />

        <Typography>Have some extra books you want to donate?&nbsp;&nbsp;
        <NextLink href="/add"><Link href="/add">
        Add Books Now
        </Link></NextLink>
        </Typography>
        
      </Box>

    
    </Container>

    <Container maxWidth="lg">
    <Typography style={{fontWeight: 'bold'}} variant={'h5'}>Recently uploaded books</Typography><br />
    <div className={styles.grid}>
      {books.map(bookData => <BookTile key={bookData.id} data={bookData} />)}
    </div>
    <br />
    <div style={{textAlign: 'center'}}>
    <Link href={`/search`}>See All Books</Link>
    </div>
    </Container>




   
</>
  );
  
}

 // build tiles - full width!!! grid layout...
  // click tile to see Book detail on URL of book's name

  // upload image to firebase
  // connect to imgix
  // use Next/Image to display

export async function getStaticProps() {
  

  const {data} = await adminClient.query({
    query: QUERY_RECENT_BOOKS
  });

  // console.log(data)


  return {
    props: {
      books: data.Books
    },
    revalidate: 600
  }
}
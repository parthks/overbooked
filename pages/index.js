import logo from '../public/logo.png'
import Image from 'next/image'
import NextLink from 'next/link'

import { useRouter } from 'next/router'


import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

import { Input } from 'antd';
import { Typography } from '@material-ui/core';

const { Search } = Input;



export default function Home({}) {
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




   
</>
  );
  
}

 // build tiles - full width!!! grid layout...
  // click tile to see Book detail on URL of book's name

  // upload image to firebase
  // connect to imgix
  // use Next/Image to display

export async function getStaticProps() {
  

  // const {data} = await adminClient.query({
  //   query: QUERY_ALL_BOOKS
  // });

  // console.log(data)


  return {
    props: {
      books: []
    },
  }
}
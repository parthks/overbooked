import React, {useState} from 'react';
import {INSERT_BOOK} from '../lib/graphql/books'
import { useMutation, useQuery } from '@apollo/client';
import firebase, {customUploadFile} from '../lib/firebase'

import { v4 as uuidv4 } from 'uuid';


import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import LinearProgress from '@material-ui/core/LinearProgress';


import SignInScreen from '../components/signInPopup'

import {  message } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import { TextField } from '@material-ui/core';


// import AuthorSelect from '../components/authorSelect'
import BookDetail from '../components/BookDetail';




export default function AddNewBook() {

  const [insertNewBook] = useMutation(INSERT_BOOK);

  // const [imageUrl, setImageUrl] = useState(null)
  // const [imageFile, setImageFile] = useState(null)

  // const [bookName, setBookName] = useState('')
  // const [author_id, setAuthorID] = useState(null)


  const [data, setData] = useState({})

  console.log('data',data)

  const [loadingPercent, setLoadingPercent] = useState(0)
  const [loading, setLoading] = useState(0)


  const submitData = async () => {
        
        if (!data.imageFile) {message.error("Image is required"); return}
        if (!data.name) {message.error("Book's name is required"); return}
        if (!data.author_ids || !data.author_ids.length) {message.error("Authors are required"); return}
        if (!data.type) {message.error("Book's genre is required"); return}

        const uid = firebase.auth().currentUser?.uid

        if (!uid) {
          message.error("Not logged in!")
          return
        }

        setLoading(true)

        const imageID = uuidv4();

        const mutatedData = await insertNewBook({variables: {
          object: {
            isbn: data.isbn ? data.isbn : null,
            name: data.name,
            cover_image: imageID,
            user_id: uid,
            type: data.type,
            book_authors: {
              data: data.author_ids.map(authorID => ({
                "author_id": authorID
              }))
            }
          }
        }})

        console.log(mutatedData.data)

        const bookID = mutatedData.data.insert_Books_one.id

        

        customUploadFile({
          fileName: imageID,
          location: "books/"+bookID,
          file: data.imageFile,
          onError: () => {
            message.error("Image upload failed")
            setLoadingPercent(0)
            setLoading(false)
          },
          onProgress: ({percent}) => setLoadingPercent(percent),
          onSuccess: () => {
            message.success("Successfully Added Book!")
            setLoadingPercent(0)
            setLoading(false)
            window.scrollTo(0,0)
            setData({})
          }           
          
        });
  }

    return <Container maxWidth="sm">
    <Box my={4}>
        <Typography>Add New Book</Typography>
    </Box>

    <SignInScreen />


    <BookDetail readOnly={false} setData={setData} data={data} />


    {loading ? 
    
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={loadingPercent} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          loadingPercent,
        )}%`}</Typography>
      </Box>
    </Box> : 

      <Button onClick={async () => {
          await submitData()
      }} variant="contained" color="primary">Submit</Button>
    }

    
  </Container>
}
import React, {useState} from 'react';
import {INSERT_BOOK} from '../lib/graphql/books'
import { useMutation, useQuery } from '@apollo/client';
import firebase from '../lib/firebase'


import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

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

    return <Container maxWidth="sm">
    <Box my={4}>
        <Typography>Add New Book</Typography>
    </Box>

    <SignInScreen />


    <BookDetail setData={setData} data={data} />


      {/* <Upload
        style={{width: '100%', maxWidth: '300px', height: '300px'}}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        // beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>

      <br /><br />

      <Typography>Book's Name</Typography>
      <TextField 
        size="small"
        variant="outlined"
        value={bookName}
        placeholder="Enter Book's Name"
        onChange={e => setBookName(e.target.value)}
        fullWidth /><br /><br />

      <Typography>Book's Author</Typography>
      <AuthorSelect onSelect={(authorID) => setAuthorID(authorID)} value={author_id} />
      <br /><br /> */}

      <Button onClick={async () => {
        if (!data.imageFile) {message.error("Image is required"); return}
        if (!data.name) {message.error("Book's name is required"); return}
        if (!data.author_id) {message.error("Author is required"); return}

        const uid = firebase.auth().currentUser?.uid

        if (!uid) {
          message.error("Not logged in!")
          return
        }

        await insertNewBook({variables: {
          author_id: data.author_id,
          name: data.name,
          image_url: data.image_url,
          user_id: uid
        }})

        message.success("Successfully Added Book!")

        setData({})

        
      }} variant="contained" color="primary">Submit</Button>



    <style jsx global>{`.avatar-uploader > .ant-upload {
      width: 100%;
      height: 300px;
    }`}</style>
  </Container>
}
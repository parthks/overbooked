import {useEffect, useState} from 'react'

import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Typography, TextField, Button, Backdrop, CircularProgress, Grid } from '@material-ui/core';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';

import AuthorSelect from './authorSelect'
import {client} from '../lib/graphql/client'
import {INSERT_AUTHOR} from '../lib/graphql/authors'


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
const ENDPOINT = "https://openlibrary.org"
const IMAGE_ENDPOINT = "https://covers.openlibrary.org/b/id/"

export default function BookDetail({data, setData, readOnly}) {
  const classes = useStyles();
  // const [isbn, setISBN] = useState(data.isbn ? data.isbn : '')
  const [isbnLoading, setISBNLoading] = useState(false)

  console.log(data)
  
  const searchISBN = async () => {
    if (!data?.isbn) {return}
    setISBNLoading(true)
    const bookDataURL = ENDPOINT + "/isbn/" + data.isbn + ".json"
    try {
      const rawData = await (await fetch(bookDataURL)).json()
      console.log(rawData)
      const bookData = {name: rawData.title}
    
      if (rawData.authors && rawData.authors.length > 0) {
        const author_ids = []
        for(let i = 0; i < rawData.authors.length; i++) {
          const authorDataURL = ENDPOINT + rawData.authors[i].key + ".json"
          const rawAuthorData = await (await fetch(authorDataURL)).json()
          const authorName = rawAuthorData.name
          const dbData = (await client.mutate({mutation: INSERT_AUTHOR, variables: {name: authorName} })).data.insert_Authors_one
          author_ids.push(dbData.id)
        }
        bookData["author_ids"] = author_ids
      }

      if (rawData.covers && rawData.covers.length > 0) {
        console.log(rawData.covers[0])
        const imageKey = rawData.covers[0]
        const imageDataURL = IMAGE_ENDPOINT + imageKey + "-L.jpg"
        const imageBlob = await (await fetch(imageDataURL)).blob()
        const imageURL = URL.createObjectURL(imageBlob)
        bookData["image_url"] = imageURL
        bookData["imageFile"] = imageBlob
      }

      console.log(bookData)
      setData({...data, ...bookData})

    } catch(e) {
      console.log(e)
      message.error("ISBN not found :(")
    } finally {
      setISBNLoading(false)
    }
    
    
  }



    const handleChange = info => {
        console.log('info', info)
        
        getBase64(info.file.originFileObj, imageUrl =>

          setData({
              ...data,
              imageFile: info.file.originFileObj,
              image_url: imageUrl
          })
        );
      };

      

  const uploadButton = (
    <div>
      {<PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Book Cover</div>
    </div>
  );


  

    // if (isbnLoading) {
    //   return <Backdrop className={classes.backdrop} open={isbnLoading}>
    //   <CircularProgress color="inherit" />
    //   </Backdrop>
    // }

    return <>

    <Backdrop className={classes.backdrop} open={isbnLoading}>
      <CircularProgress color="inherit" />
      </Backdrop>
    

    <Typography>Enter ISBN to auto fill book details</Typography>
    <Grid container spacing={1}>
      <Grid item>
        <TextField disabled={readOnly} label="Book's ISBN" 
        value={data?.isbn ? data?.isbn : ''} 
        onChange={(e) => setData({...data, isbn: e.target.value.replace(/[^0-9]/g, '')}) } />
      </Grid>
      <Grid item>
        <Button disabled={readOnly} onClick={() => searchISBN()} variant="contained" color="primary">Search Book ISBN</Button>
      </Grid>
    </Grid>
    <br />

    <Typography>Or manually fill in all the book's details</Typography>

    <Upload
        style={{width: '100%', maxWidth: '300px', height: '300px'}}
        name="avatar"
        accept="image/*"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        disabled={readOnly}
        // beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        { data?.image_url ?
            <img src={data.image_url} alt="avatar" style={{ maxWidth: '100%', maxHeight: '300px' }} /> 
        : data?.cover_image && data?.id ?
          <img src={"https://overbooked.imgix.net/books/"+data.id+"/"+data.cover_image+"?w=600"} alt="avatar" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        : uploadButton}
      </Upload>

      <br /><br />

      <Typography>Book's Name</Typography>
      <TextField 
        disabled={readOnly}
        size="small"
        variant="outlined"
        value={data?.name ? data?.name : ''}
        placeholder="Enter Book's Name"
        onChange={e => {
            setData({
                ...data,
                name: e.target.value
            })
            // setBookName(e.target.value)
        }}
        fullWidth /><br /><br />

      <Typography>Book's Author</Typography>
      <AuthorSelect disabled={readOnly} onSelect={(authorIDs) => {
           setData({
            ...data,
            author_ids: authorIDs
        })
        //   setAuthorID(authorID)
          }} value={data?.author_ids} />
      <br /><br />

    <FormControl component="fieldset">
        <FormLabel component="legend">Book's Genre</FormLabel>
        <RadioGroup disabled={readOnly} row aria-label="type" name="type" value={data?.type ? data?.type : ''} onChange={(e) => setData({...data, type: e.target.value})}>
            <FormControlLabel value="fiction" control={<Radio color="primary" />} label="Fiction" />
            <FormControlLabel value="non-fiction" control={<Radio color="primary" />} label="Non-Fiction" />
        </RadioGroup>
    </FormControl>

    <br /><br />

    <style jsx global>{`.avatar-uploader > .ant-upload {
      width: 100%;
      height: 300px;
    }`}</style>

    </>
}
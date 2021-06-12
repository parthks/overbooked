
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Typography, TextField } from '@material-ui/core';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import AuthorSelect from './authorSelect'


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  
export default function BookDetail({data, setData}) {

    const handleChange = info => {
        console.log('info', info)
    
        // setImageFile(info.file.originFileObj)
    
        getBase64(info.file.originFileObj, imageUrl =>
        //   setImageUrl(imageUrl)
          setData({
              ...data,
              imageFile: info.file.originFileObj,
              image_url: imageUrl
          })
        );
    
    
        // if (info.file.status === 'uploading') {
        //   // this.setState({ loading: true });
          
         
        //   return;
        // }
        // if (info.file.status === 'done') {
        //   // Get this url from response in real world.
        //   getBase64(info.file.originFileObj, imageUrl =>
        //     setImageUrl(imageUrl)
        //   );
        // }
      };

      

  const uploadButton = (
    <div>
      {<PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Book Cover</div>
    </div>
  );



    return <>

    <Upload
        style={{width: '100%', maxWidth: '300px', height: '300px'}}
        name="avatar"
        accept="image/*"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        // beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        { data?.image_url ?
            <img src={data.image_url} alt="avatar" style={{ maxWidth: '100%', maxHeight: '300px' }} /> 
        : data?.id ?
          <img src={"https://overbooked.imgix.net/books/"+data.id+"/cover?w=600"} alt="avatar" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        : uploadButton}
      </Upload>

      <br /><br />

      <Typography>Book's Name</Typography>
      <TextField 
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
      <AuthorSelect onSelect={(authorIDs) => {
           setData({
            ...data,
            author_ids: authorIDs
        })
        //   setAuthorID(authorID)
          }} value={data?.author_ids} />
      <br /><br />

    <FormControl component="fieldset">
        <FormLabel component="legend">Book's Type</FormLabel>
        <RadioGroup row aria-label="type" name="type" value={data.type} onChange={(e) => setData({...data, type: e.target.value})}>
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
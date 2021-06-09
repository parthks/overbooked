
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Typography, TextField } from '@material-ui/core';


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
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        // beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {data?.image_url ? <img src={data.image_url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
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
      <AuthorSelect onSelect={(authorID) => {
           setData({
            ...data,
            author_id: authorID
        })
        //   setAuthorID(authorID)
          }} value={data?.author_id} />
      <br /><br />

    </>
}
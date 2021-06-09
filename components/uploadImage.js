import {useState} from 'react'

import { Upload, message, Icon } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';



export default function CustomUpload({imageUrl, setImageURL}) {
    const [loading, setLoading] = useState(false)
    
    handleChange = (info) => {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {

        getBase64(info.file.originFileObj, imageUrl => this.setState({
          imageUrl,
          loading: false
        }));

      }
    };
  
    beforeUpload = (file) => {
      const isImage = file.type.indexOf('image/') === 0;
      if (!isImage) {
        message.error('You can only upload image file!');
      }
      
      // You can remove this validation if you want
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must smaller than 5MB!');
      }
      return isImage && isLt5M;
    };
  

    const customUpload = async ({ onError, onSuccess, file, onProgress }) => {
        let fileId = uuidv4()
        const fileRef = stg.ref('demo').child(fileId)
        try {
          const image = fileRef.put(file, { customMetadata: { uploadedBy: myName, fileName: file.name } })
    
          image.on(
            'state_changed',
            (snap) => onProgress({ percent: (snap.bytesTransferred / snap.totalBytes) * 100 }),
            (err) => onError(err),
            () => onSuccess(null, image.metadata_)
          )
        } catch (e) {
          onError(e)
        }
    }
    
    
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
      );

    return (
        <div>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            customRequest={customUpload}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
          </Upload>
        </div>
      );
    
  }
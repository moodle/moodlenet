import { t, Trans } from '@lingui/macro';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import LinkIcon from '@material-ui/icons/Link';
import React, { useState } from 'react';
import Card from '../../../components/atoms/Card/Card';
import InputTextField from '../../../components/atoms/InputTextField/InputTextField';
import uploadFileIcon from '../../../static/icons/upload-file.svg';
import uploadImageIcon from '../../../static/icons/upload-image.svg';
import './styles.scss';

type UploadResourceState = 'Initial' | 'ContentUploaded' | 'ImageUploaded' | 'AllSet' | 'AllSetImage'
type ContentType = 'File' | 'Link' | ''

export type UploadResourceProps = {
}

export type Content = {
  name: string | undefined
  type: ContentType | undefined
  title: string | undefined
  description: string | undefined
  category: string |undefined
  imagePath: string | undefined
}

export const UploadResource = () => {
  const [content, setContent] = useState<Content>({name: undefined, type: undefined, category: undefined, description: undefined, title: undefined, imagePath: undefined})
  const [state, setState] = useState<UploadResourceState>('Initial')

  const background = {
    backgroundImage: 'url(' + content.imagePath + ')',
    backgroundSize: 'cover',
  }

  const setLink = (text: string) => {
    setContent({...content, name: text})
    setState('ContentUploaded')
  }

  const selectFile = () => {
    document.getElementById("uploadFile")?.click()
  }

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      setContent({...content, name: e.currentTarget.value.split('\\').pop()?.split('/').pop(), type: 'File'})
      setState('ContentUploaded')
    }
  }

  const selectImage = () => {
    document.getElementById("uploadImage")?.click()
  }

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement> ) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setContent({...content, imagePath: URL.createObjectURL(e.currentTarget.files[0])})
      setState('ImageUploaded')
    }
  }

  const deleteImage = () => {
    setContent({...content, imagePath: undefined})
    setState('ContentUploaded')
  }

  const onTitleChange = (text: string) => setContent({...content, title: text})
  const onDescriptionChange = (text: string) => setContent({...content, description: text})
  const onCategoryChange = (text: string) => setContent({...content, category: text})

  return (
    <div className="upload-resource">
      <div className="main-column">
        <div className="card-title">
          <Trans>Content</Trans>
        </div>
        <Card>
          <div className="main-container">
            {state !== 'ImageUploaded' ? (
            <div className="uploader">
              {state === 'Initial' ? (
                <div className="file upload" hidden={state !== 'Initial'} onClick={selectFile}>
                  <input id="uploadFile" type="file" name="myFile" onChange={uploadFile} hidden/>
                  <img src={uploadFileIcon} />
                  <span>
                    <Trans>Drop a file here or click to upload!</Trans>
                  </span>
                </div>
              ) : state === 'ContentUploaded' ? (
                <div className="image upload" hidden={state !== 'ContentUploaded'} onClick={selectImage}>
                  <input id="uploadImage" type="file" name="myImage" onChange={uploadImage} hidden/>
                  <img src={uploadImageIcon} />
                  <span>
                    <Trans>Drop an image here or click to upload!</Trans>
                  </span>
                </div>
              ) : ( <></>)}
              </div>
            ) : (
              <div className="image-container" style={background}>
                <div className="delete-image" onClick={deleteImage}><CloseRoundedIcon /></div>
              </div>
            )}
          </div>
          <div className="bottom-container">
          {state === 'Initial'  ? (
            <InputTextField
              className="link"
              placeholder={t`Paste or type a link`}
              getText={setLink}
              buttonName={t`Add`}
            />
            ) : (
            <div className="uploaded-name">
              <div className="content-icon">
                { content.type === 'File' ? (
                  <InsertDriveFileIcon />
                ) : (
                  <LinkIcon />
                )}
              </div>
              {content.name}
            </div>
            )}
          </div>
        </Card>
      </div>
      <div className="side-column">
        <InputTextField label="Title" placeholder="" disabled={state === 'Initial'} getText={onTitleChange}/>
        <InputTextField textarea={true} label="Description" placeholder="" disabled={state === 'Initial'} getText={onDescriptionChange} />
        <InputTextField label="Categories" placeholder="" disabled={state === 'Initial'} getText={onCategoryChange}/>
      </div>
    </div>
  )
}

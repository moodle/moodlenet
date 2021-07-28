import { t, Trans } from '@lingui/macro';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import LinkIcon from '@material-ui/icons/Link';
import React, { useEffect, useState } from 'react';
import Card from '../../../components/atoms/Card/Card';
import InputTextField from '../../../components/atoms/InputTextField/InputTextField';
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton';
import { withCtrl } from '../../../lib/ctrl';
import uploadFileIcon from '../../../static/icons/upload-file.svg';
import uploadImageIcon from '../../../static/icons/upload-image.svg';
import './styles.scss';

type UploadResourceState = 'Initial' | 'ContentUploaded' | 'ImageUploaded' | 'AllSet' | 'AllSetImage'
type ContentType = 'File' | 'Link' | ''

export type UploadResourceProps = {
  state: UploadResourceState
}

export type Content = {
  name: string | undefined
  type: ContentType | undefined
  title: string | undefined
  description: string | undefined
  category: string |undefined
  imagePath: string | undefined
}

const emptyContent = {name: undefined, type: undefined, category: undefined, description: undefined, title: undefined, imagePath: undefined}

export const UploadResource = withCtrl<UploadResourceProps>(({state}) => {
  const [content, setContent] = useState<Content>(emptyContent)
  const [currentState, setCurrentState] = useState<UploadResourceState>(state)

  const background = {
    backgroundImage: 'url(' + content.imagePath + ')',
    backgroundSize: 'cover',
  }

  const setLink = (text: string) => {
    setContent({...content, name: text, type: 'Link'})
    setCurrentState('ContentUploaded')
  }

  const selectFile = () => {
    document.getElementById("uploadFile")?.click()
  }

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      setContent({...content, name: e.currentTarget.value.split('\\').pop()?.split('/').pop(), type: 'File'})
      setCurrentState('ContentUploaded')
    }
  }

  const selectImage = () => {
    document.getElementById("uploadImage")?.click()
  }

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement> ) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setContent({...content, imagePath: URL.createObjectURL(e.currentTarget.files[0])})
      setCurrentState('ImageUploaded')
    }
  }

  const deleteImage = () => {
    setContent({...content, imagePath: undefined})
    setCurrentState('ContentUploaded')
  }

  const deleteContent = () => {
    setContent(emptyContent)
    setCurrentState('Initial')
  }

  const toCollections = () => {
    console.log('Done')
  }

  useEffect(() => {
    const isAllSet = () => {
      if (content.title && content.title.length > 0  && 
          content.type && 
          content.name && 
          content.description && 
          content.description.length >= 5 && 
          content.category && content.category.length >= 5
      ) {
        if (content.imagePath) { 
          setCurrentState('AllSetImage')
        } else {
          setCurrentState('AllSet')
        }
        return true
      } else if (content.imagePath ) {
        setCurrentState('ImageUploaded')
      } else if (content.type) {
        setCurrentState('ContentUploaded')
      } else {
        setCurrentState('Initial')
      }
      return false
    }
    isAllSet()
  }, [content.title, content.category, content.description, content.imagePath, content.name, content.type, currentState]);

  const onTitleChange = (text: string) => setContent({...content, title: text})
  const onDescriptionChange = (text: string) => setContent({...content, description: text})
  const onCategoryChange = (text: string) => setContent({...content, category: text})

  return (
    <div className="upload-resource">
      <div className="content">
        <div className="main-column">
          <div className="card-title">
            <Trans>Content</Trans>
          </div>
          <Card>
            <div className="main-container">
              {currentState !== 'ImageUploaded' && currentState !== 'AllSetImage' ? (
              <div className="uploader">
                {currentState === 'Initial' ? (
                  <div className="file upload" hidden={currentState !== 'Initial'} onClick={selectFile}>
                    <input id="uploadFile" type="file" name="myFile" onChange={uploadFile} hidden/>
                    <img src={uploadFileIcon} />
                    <span>
                      <Trans>Drop a file here or click to upload!</Trans>
                    </span>
                  </div>
                ) : currentState === 'ContentUploaded' || currentState === 'AllSet' ? (
                  <div className="image upload" onClick={selectImage}>
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
            {currentState === 'Initial'  ? (
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
          <div className="small-screen-details">
            <InputTextField autoUpdate={true} label="Title" placeholder="" disabled={currentState === 'Initial'} getText={onTitleChange}/>
            <InputTextField autoUpdate={true} textarea={true} label="Description" placeholder="" disabled={currentState === 'Initial'} getText={onDescriptionChange} />
            <InputTextField autoUpdate={true} label="Categories" placeholder="" disabled={currentState === 'Initial'} getText={onCategoryChange}/>
          </div>
        </div>
        <div className="side-column">
          <InputTextField autoUpdate={true} label="Title" placeholder="" disabled={currentState === 'Initial'} getText={onTitleChange}/>
          <InputTextField autoUpdate={true} textarea={true} label="Description" placeholder="" disabled={currentState === 'Initial'} getText={onDescriptionChange} />
          <InputTextField autoUpdate={true} label="Categories" placeholder="" disabled={currentState === 'Initial'} getText={onCategoryChange}/>
        </div>
      </div>
      <div className="footer">
        { currentState !== 'Initial' && <SecondaryButton onClick={deleteContent} type="grey"><Trans>Delete</Trans></SecondaryButton>}
        <PrimaryButton disabled={currentState !== 'AllSet' && currentState !== 'AllSetImage'} onClick={toCollections}><Trans>Next</Trans></PrimaryButton>
      </div>
    </div>
  )
})

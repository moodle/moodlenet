import { t, Trans } from '@lingui/macro'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import LinkIcon from '@material-ui/icons/Link'
import React, { useState } from 'react'
import Card from '../../../components/atoms/Card/Card'
import InputTextField from '../../../components/atoms/InputTextField/InputTextField'
import { withCtrl } from '../../../lib/ctrl'
import uploadFileIcon from '../../../static/icons/upload-file.svg'
import uploadImageIcon from '../../../static/icons/upload-image.svg'
import './styles.scss'

type UploadResourceState = 'Initial' | 'ContentUploaded' | 'ImageUploaded' | 'AllSet' | 'AllSetImage'
type ContentType = 'File' | 'Link' | ''

export type UploadResourceProps = {
  type?: ContentType
  imageUrl?: string
}

export type Content = {
  name: string | undefined
  type: ContentType | undefined
  title: string | undefined
  description: string | undefined
  category: string |undefined
}

export const UploadResource = withCtrl<UploadResourceProps>(({ imageUrl }) => {
  const background = {
    backgroundImage: 'url(' + imageUrl + ')',
    backgroundSize: 'cover',
  }

  const [content, setContent] = useState<Content>({name: undefined, type: undefined, category: undefined, description: undefined, title: undefined})
  const [state, setState] = useState<UploadResourceState>('Initial')

  const setLink = (text: string) => {
    setContent({...content, name: ''})
    setState('ContentUploaded')
  }

  const selectFile = () => {
    document.getElementById("uploadFile")?.click()
  }

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent({...content, name: e.currentTarget.value.split('\\').pop()?.split('/').pop(), type: 'File'})
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
            <div className="uploader" hidden={state === 'ImageUploaded'}>
            {state === 'Initial' ? 
              <div className="file upload" hidden={state !== 'Initial'} onClick={selectFile}>
                <img src={uploadFileIcon} />
                <input id="uploadFile" type="file" name="myFile" onChange={uploadFile} hidden/>
                <span>
                  <Trans>Drop a file here or click to upload!</Trans>
                </span>
              </div>
            : state === 'ContentUploaded' ?
              <div className="image upload" hidden={state !== 'ContentUploaded'}>
                <img src={uploadImageIcon} />
                <span>
                  <Trans>Drop an image here or click to upload!</Trans>
                </span>
              </div>
              : <></>}
            </div>
            {state === 'ImageUploaded' ? <div className="image-container" style={background} /> : <></>}
          </div>
          <div className="bottom-container">
          {!content ? (
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
})

import { t, Trans } from '@lingui/macro'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import LinkIcon from '@material-ui/icons/Link'
import React from 'react'
import Card from '../../../components/atoms/Card/Card'
import Dropdown from '../../../components/atoms/Dropdown/Dropdown'
import InputTextField from '../../../components/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
import { withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import uploadFileIcon from '../../../static/icons/upload-file.svg'
import uploadImageIcon from '../../../static/icons/upload-image.svg'
import { Field } from '../FieldsData'
import { NewResourceFormValues } from '../types'
import './styles.scss'
type UploadResourceState = 'ChooseResource' | 'EditData'

export type UploadResourceProps = {
  step: 'UploadResourceStep'
  state: UploadResourceState
  formBag: FormikBag<NewResourceFormValues>,
  imageUrl: string
  categories: Field
  nextStep: (() => unknown) | undefined
  deleteContent: () => unknown
}

export const UploadResource = withCtrl<UploadResourceProps>(({ formBag, state, imageUrl, categories, nextStep, deleteContent }) => {
  const [form, formAttrs] = formBag
  const background = {
    backgroundImage: 'url(' + imageUrl + ')',
    backgroundSize: 'cover',
  }
  const setLink = (link: string) => {
    form.setFieldValue('content', link)
    form.setFieldValue('contentType', 'Link')
  }

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files?.item(0)
    if (selectedFile) {
      form.setFieldValue('content', selectedFile)
      form.setFieldValue('contentType', 'File')
    }
  }

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files?.item(0)
    form.setFieldValue('image', selectedFile ?? null)
  }

  const deleteImage = () => {
    form.setFieldValue('image', null)
  }

  const dataInputs = (
    <div>
      <InputTextField
        autoUpdate={true}
        value={form.values.title}
        label="Title"
        placeholder=""
        disabled={state === 'ChooseResource'}
        {...formAttrs.title}
      />
      <InputTextField
        autoUpdate={true}
        value={form.values.description}
        textarea={true}
        label="Description"
        placeholder=""
        disabled={state === 'ChooseResource'}
        {...formAttrs.description}
      />
      <Dropdown 
        {...categories}
        disabled={state === 'ChooseResource'}
        {...formAttrs.category}
      />
    </div>
  )
  const selectImage = () => {
    //FIXME: useRef()s
    document.getElementById('uploadImage')?.click()
  }
  const selectFile = () => {
    //FIXME: useRef()s
    document.getElementById('uploadFile')?.click()
  }

  return (
    <div className="upload-resource">
      <div className="content">
        <div className="main-column">
          <div className="card-title">
            <Trans>Content</Trans>
          </div>
          <Card>
            <div className="main-container">
              {!imageUrl ? (
                <div className="uploader">
                  {state === 'ChooseResource' ? (
                    <div className="file upload" onClick={selectFile}>
                      <input id="uploadFile" type="file" name="myFile" onChange={uploadFile} hidden />
                      <img src={uploadFileIcon} alt="resource file icon" />
                      <span>
                        <Trans>Drop a file here or click to upload!</Trans>
                      </span>
                    </div>
                  ) : (
                    <div className="image upload" onClick={selectImage}>
                      <input
                        id="uploadImage"
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif"
                        name="myImage"
                        onChange={uploadImage}
                        hidden
                      />
                      <img src={uploadImageIcon} alt="resource backgroud icon" />
                      <span>
                        <Trans>Drop an image here or click to upload!</Trans>
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="image-container" style={background}>
                  <div className="delete-image" onClick={deleteImage}>
                    <CloseRoundedIcon />
                  </div>
                </div>
              )}
            </div>
            <div className="bottom-container">
              {state === 'ChooseResource' ? (
                <InputTextField
                  className="link"
                  placeholder={t`Paste or type a link`}
                  getText={setLink}
                  buttonName={t`Add`}
                />
              ) : (
                <div className="uploaded-name">
                  <div className="content-icon">
                    {form.values.contentType === 'File' ? <InsertDriveFileIcon /> : <LinkIcon />}
                  </div>
                  {form.values.name}
                </div>
              )}
            </div>
          </Card>
          <div className="small-screen-details">{dataInputs}</div>
        </div>
        <div className="side-column">{dataInputs}</div>
      </div>
      <div className="footer">
        {state === 'EditData' && (
          <SecondaryButton onClick={deleteContent} type="grey">
            <Trans>Delete</Trans>
          </SecondaryButton>
        )}
        <PrimaryButton disabled={!nextStep} onClick={nextStep}>
          <Trans>Next</Trans>
        </PrimaryButton>
      </div>
    </div>
  )
})

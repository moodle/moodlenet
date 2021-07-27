import { t, Trans } from '@lingui/macro'
import Card from '../../../components/atoms/Card/Card'
import InputTextField from '../../../components/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import { withCtrl } from '../../../lib/ctrl'
import uploadFileIcon from '../../../static/icons/upload-file.svg'
import uploadImageIcon from '../../../static/icons/upload-image.svg'
import './styles.scss'

type UploadResourceState = 'Initial' | 'ContentUploaded' | 'ImageUploaded' | 'AllSet' | 'AllSetImage'
type ContentType = 'File' | 'Link' | ''

export type UploadResourceProps = {
  state: UploadResourceState
  type?: ContentType
  imageUrl?: string
}

export const UploadResource = withCtrl<UploadResourceProps>(({ state, type, imageUrl }) => {
  const background = {
    backgroundImage: 'url(' + imageUrl + ')',
    backgroundSize: 'cover',
  }
  return (
    <div className="upload-resource">
      <div className="main-column">
        <div className="card-title">
          <Trans>Content</Trans>
        </div>
        <Card>
          <div className="main-container">
            <div className="uploader" hidden={state === 'ImageUploaded'}>
              <div className="file upload" hidden={state !== 'Initial'}>
                <img src={uploadFileIcon} />
                <span>
                  <Trans>Drop a file here or click to upload!</Trans>
                </span>
              </div>
              <div className="image upload" hidden={state !== 'ContentUploaded'}>
                <img src={uploadImageIcon} />
                <span>
                  <Trans>Drop an image here or click to upload!</Trans>
                </span>
              </div>
            </div>
            {state === 'ImageUploaded' ? <div className="image-container" style={background} /> : <></>}
          </div>
          <div className="bottom-container">
            <InputTextField
              className="link"
              hidden={state !== 'Initial'}
              placeholder={`${t`Paste or type a link`}`}
              button={<PrimaryButton>Add</PrimaryButton>}
            />
            <div  ></div>
            <div className="uploaded-file" hidden={state !== 'ContentUploaded' || type !== 'File'}></div>
            <div className="uploaded-link" hidden={state !== 'ContentUploaded' || type !== 'Link'}></div>
          </div>
        </Card>
      </div>
      <div className="side-column">
        <InputTextField label="Title" placeholder="" disabled={state === 'Initial'} />
        <InputTextField textarea={true} label="Description" placeholder="" disabled={state === 'Initial'} />
        <InputTextField label="Categories" placeholder="" disabled={state === 'Initial'} />
      </div>
    </div>
  )
})

import { Trans } from '@lingui/macro'
import Card from '../../../components/atoms/Card/Card'
import { withCtrl } from '../../../lib/ctrl'
import uploadFileIcon from '../../../static/icons/upload-file.svg'
import './styles.scss'

type UploadResourceState = 'Initial' | 'ContentUploaded' | 'ImageUploaded' | 'AllSet' | 'AllSetImage'
type ContentType = 'File' | 'Link' | ''

export type UploadResourceProps = {
  state: UploadResourceState
  type?: ContentType
  imageUrl?: string
}

export const UploadResource = withCtrl<UploadResourceProps>(({
  state,
  type,
  imageUrl
}) => {
    return (
      <div className="upload-resource">
        <div className="main-column">
          <Card>
            <div className='main-container'>
              <div className="uploader">
                <div className="file upload" hidden={state !== 'Initial'}>
                  <img src={uploadFileIcon} />
                  <span><Trans>Drop a file here or click to upload!</Trans></span>
                </div>
                <div className="image upload" hidden={state !== 'ContentUploaded'}></div>
              </div>
              {state === 'ImageUploaded' ? <img className="image-uploaded" src={imageUrl} alt="Background" />: <></>}
            </div>
            <div className="bottom-container">
              <div className="link" hidden={state !== 'Initial'}></div>
              <div className="uploaded-file" hidden={state!== 'ContentUploaded' || type !== 'File'}></div>
              <div className="uploaded-link" hidden={state!== 'ContentUploaded' || type !== 'Link'}></div>
            </div>
          </Card>
        </div>
        <div className="side-column">

        </div>
      </div>
    )
  },
)

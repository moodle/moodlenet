import { Trans } from '@lingui/macro'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import React, { useCallback } from 'react'
import Card from '../../../components/atoms/Card/Card'
import InputTextField from '../../../components/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import { withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { ReactComponent as UploadImageIcon } from '../../../static/icons/upload-image.svg'
import { NewCollectionFormValues } from '../types'
import './styles.scss'

export type CreateCollectionProps = {
  step: 'CreateCollectionStep'
  formBag: FormikBag<NewCollectionFormValues>
  imageUrl: string
  finish: (() => unknown) | undefined
}

export const CreateCollection = withCtrl<CreateCollectionProps>(
  ({ formBag, imageUrl, finish }) => {
    const [form] = formBag
    const setFieldValue = form.setFieldValue
    const background = {
      backgroundImage: 'url(' + imageUrl + ')',
      backgroundSize: 'cover',
    }

    const uploadImage = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.currentTarget.files?.item(0)
        setFieldValue('image', selectedFile ?? null)
      },
      [setFieldValue],
    )

    const deleteImage = useCallback(() => {
      setFieldValue('image', null)
    }, [setFieldValue])

    const dataInputs = (
      <div>
        <InputTextField
          autoUpdate={true}
          label="Title"
          placeholder=""
          getText={text => form.setFieldValue('title', text)}
          value={form.values.title}
        />
        <InputTextField
          autoUpdate={true}
          textarea={true}
          label="Description"
          placeholder=""
          value={form.values.description}
          getText={text => form.setFieldValue('description', text)}
        />
      </div>
    )

    const selectImage = () => {
      //FIXME: useRef()s
      document.getElementById('uploadImage')?.click()
    }

    return (
      <div className="upload-resource">
        <div className="title"><Trans>Create Collection</Trans></div>
        <div className="content">
          <div className="main-column">
            <div className="card-title">
              <Trans>Cover Image</Trans>
            </div>
            <Card>
              <div className="main-container">
                {!imageUrl ? (
                  <div className="uploader">
                    <div className="image upload" onClick={selectImage}>
                      <input
                        id="uploadImage"
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif"
                        name="myImage"
                        onChange={uploadImage}
                        hidden
                      />
                      <UploadImageIcon />
                      <span>
                        <Trans>Click to upload an image!</Trans>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="image-container" style={background}>
                    <div className="delete-image" onClick={deleteImage}>
                      <CloseRoundedIcon />
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <div className="small-screen-details">{dataInputs}</div>
          </div>
          <div className="side-column">{dataInputs}</div>
        </div>
        <div className="footer">
          <PrimaryButton disabled={!finish} onClick={finish}>
            <Trans>Create collection</Trans>
          </PrimaryButton>
        </div>
      </div>
    )
  },
)

import { Trans } from '@lingui/macro'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import React, { useCallback, useRef } from 'react'
import { withCtrl } from '../../../../lib/ctrl'
import { FormikHandle } from '../../../../lib/formik'
import { useImageUrl } from '../../../../lib/useImageUrl'
import { ReactComponent as UploadImageIcon } from '../../../../static/icons/upload-image.svg'
import { AssetInfo } from '../../../../types'
import Card from '../../../atoms/Card/Card'
import { InputTextField } from '../../../atoms/InputTextField/InputTextField'
import Loading from '../../../atoms/Loading/Loading'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import { VisibilityDropdown } from '../../../atoms/VisibilityDropdown/VisibilityDropdown'
import { NewCollectionFormValues } from '../types'
import './styles.scss'

export type CreateCollectionProps = {
  step: 'CreateCollectionStep'
  form: FormikHandle<NewCollectionFormValues>
}

export const CreateCollection = withCtrl<CreateCollectionProps>(({ form }) => {
  const shouldShowErrors = !!form.submitCount && !form.isValid
  const [imageUrl] = useImageUrl(form.values.image?.location)
  const background = {
    backgroundImage: 'url("' + imageUrl + '")',
    backgroundSize: 'cover',
  }

  const uploadImageRef = useRef<HTMLInputElement>(null)
  const selectImage = () => {
    uploadImageRef.current?.click()
  }
  const uploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.currentTarget.files?.item(0)
      if (selectedFile) {
        const fileAssetInfo: AssetInfo = { location: selectedFile }
        form.setFieldValue('image', fileAssetInfo)
      }
    },
    [form]
  )

  const deleteImage = useCallback(() => {
    form.setFieldValue('image', null)
  }, [form])

  const dataInputs = (
    <div>
      <InputTextField
        name="title"
        label="Title"
        value={form.values.title}
        placeholder=""
        edit
        onChange={form.handleChange}
        disabled={form.isSubmitting}
        error={shouldShowErrors && form.errors.title}
      />
      <InputTextField
        textarea
        name="description"
        label="Description"
        value={form.values.description}
        placeholder=""
        edit
        onChange={form.handleChange}
        disabled={form.isSubmitting}
        error={shouldShowErrors && form.errors.description}
      />
      <VisibilityDropdown
        name="visibility"
        value={form.values.visibility}
        onChange={form.handleChange}
        edit
        label="Visibility"
        highlight={shouldShowErrors && !!form.errors.visibility}
        disabled={form.isSubmitting}
        error={shouldShowErrors && form.errors.visibility}
      />
    </div>
  )

  return (
    <div className="create-collection">
      <div className="title">
        <Trans>Create Collection</Trans>
      </div>
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
                      ref={uploadImageRef}
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
                  <div
                    className="delete-image"
                    onClick={deleteImage}
                    style={{
                      pointerEvents: form.isSubmitting ? 'none' : 'inherit',
                    }}
                  >
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
        <PrimaryButton
          className={`${form.isSubmitting ? 'loading' : ''}`}
          onClick={form.submitForm}
        >
          <div
            className="loading"
            style={{ visibility: form.isSubmitting ? 'visible' : 'hidden' }}
          >
            <Loading color="white" />
          </div>
          <div
            className="label"
            style={{ visibility: form.isSubmitting ? 'hidden' : 'visible' }}
          >
            <Trans>Create collection</Trans>
          </div>
        </PrimaryButton>
      </div>
    </div>
  )
})

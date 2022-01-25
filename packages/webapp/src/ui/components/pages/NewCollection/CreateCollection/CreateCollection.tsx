import { t, Trans } from '@lingui/macro'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import React, { useCallback } from 'react'
import { withCtrl } from '../../../../lib/ctrl'
import { FormikHandle } from '../../../../lib/formik'
import { useImageUrl } from '../../../../lib/useImageUrl'
import { ReactComponent as UploadImageIcon } from '../../../../static/icons/upload-image.svg'
import Card from '../../../atoms/Card/Card'
import {
  Dropdown,
  IconPill,
  IconTextOption,
} from '../../../atoms/Dropdown/Dropdown'
import { InputTextField } from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import { NewCollectionFormValues } from '../types'
import './styles.scss'

export type CreateCollectionProps = {
  step: 'CreateCollectionStep'
  form: FormikHandle<NewCollectionFormValues>
}

export const CreateCollection = withCtrl<CreateCollectionProps>(({ form }) => {
  const shouldShowErrors = !!form.submitCount && !form.isValid
  const [imageUrl] = useImageUrl(form.values.image)
  const background = {
    backgroundImage: 'url(' + imageUrl + ')',
    backgroundSize: 'cover',
  }

  const uploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.currentTarget.files?.item(0)
      form.setFieldValue('image', selectedFile)
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
        error={shouldShowErrors && form.errors.description}
      />
      <Dropdown
        name="visibility"
        value={form.values.visibility}
        onChange={form.handleChange}
        edit
        label="Visibility"
        highlight={shouldShowErrors && !!form.errors.visibility}
        error={form.errors.visibility}
        pills={
          form.values.visibility && (
            <IconPill
              icon={
                form.values.visibility === 'Public' ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon />
                )
              }
            />
          )
        }
        className="visibility-dropdown"
      >
        {form.values.visibility !== 'Public' && (
          <IconTextOption
            key={'Public'}
            value={'Public'}
            label={t`Public`}
            icon={<VisibilityIcon />}
          />
        )}
        {form.values.visibility !== 'Private' && (
          <IconTextOption
            key={'Private'}
            value={'Private'}
            label={t`Private`}
            icon={<VisibilityOffIcon />}
          />
        )}
      </Dropdown>
    </div>
  )

  const selectImage = () => {
    //FIXME: useRef()s
    document.getElementById('uploadImage')?.click()
  }

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
        <PrimaryButton onClick={form.submitForm}>
          <Trans>Create collection</Trans>
        </PrimaryButton>
      </div>
    </div>
  )
})

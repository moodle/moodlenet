import { Trans } from '@lingui/macro'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import React, { useCallback } from 'react'
import { withCtrl } from '../../../../lib/ctrl'
import { SimplifiedFormik } from '../../../../lib/formik'
import { ReactComponent as UploadImageIcon } from '../../../../static/icons/upload-image.svg'
import Card from '../../../atoms/Card/Card'
import { Dropdown } from '../../../atoms/DropdownNew/Dropdown'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import { NewCollectionFormValuesNew } from '../types'
import './styles.scss'

export type CreateCollectionProps = {
  form: SimplifiedFormik<NewCollectionFormValuesNew>
}

export const CreateCollection = withCtrl<CreateCollectionProps>(({ form }) => {
  const background = {
    backgroundImage: 'url(' + form.values.imageUrl + ')',
    backgroundSize: 'cover',
  }

  const uploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.currentTarget.files?.item(0)
      form.setFieldValue('image', selectedFile ?? null)
    },
    [form]
  )

  const dataInputs = (
    <div>
      <InputTextField
        autoUpdate={true}
        label="Title"
        placeholder=""
        getText={(text) => form.setFieldValue('title', text)}
        value={form.values.title}
        highlight={!!form.errors.title}
      />
      <InputTextField
        autoUpdate={true}
        textarea={true}
        label="Description"
        placeholder=""
        value={form.values.description}
        getText={(text) => form.setFieldValue('description', text)}
        highlight={!!form.errors.description}
      />
      <Dropdown
        onChange={form.handleChange}
        label="Visibility"
        value={form.values.published}
        className="visibility-dropdown"
        highlight={!!form.errors.published}
        edit={true}
        getOptionIcon={() => null}
        getOptionLabel={() => null}
        searchByText={() => null}
      ></Dropdown>
    </div>
  )

  const selectImage = () => {
    //FIXME: useRef()s
    document.getElementById('uploadImage')?.click()
  }

  return (
    <div className="upload-resource">
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
              {!form.values.imageUrl ? (
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
                  <div
                    className="delete-image"
                    onClick={() => form.setFieldValue('image', null)}
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
        <PrimaryButton onClick={form.submitForm}>
          <Trans>Create collection</Trans>
        </PrimaryButton>
      </div>
    </div>
  )
})

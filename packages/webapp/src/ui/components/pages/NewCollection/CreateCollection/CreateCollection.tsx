import { Trans } from '@lingui/macro'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import React, { useCallback, useState } from 'react'
import { withCtrl } from '../../../../lib/ctrl'
import { FormikBag } from '../../../../lib/formik'
import { ReactComponent as UploadImageIcon } from '../../../../static/icons/upload-image.svg'
import Card from '../../../atoms/Card/Card'
import Dropdown from '../../../atoms/Dropdown/Dropdown'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import { DropdownField } from '../../NewResource/FieldsData'
import { NewCollectionFormValues } from '../types'
import './styles.scss'

export type CreateCollectionProps = {
  step: 'CreateCollectionStep'
  formBag: FormikBag<NewCollectionFormValues>
  imageUrl: string
  visibility: DropdownField
  finish: (() => unknown) | undefined
}

export const CreateCollection = withCtrl<CreateCollectionProps>(
  ({ formBag, imageUrl, visibility, finish }) => {
    const [highlightMandatoryFields, setHighlightMandatoryFields] =
      useState<boolean>(false)
    const [form] = formBag
    const setFieldValue = form.setFieldValue
    const background = {
      backgroundImage: 'url(' + imageUrl + ')',
      backgroundSize: 'cover',
    }

    const createCollection = () =>
      finish ? finish() : setHighlightMandatoryFields(true)

    const uploadImage = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.currentTarget.files?.item(0)
        setFieldValue('image', selectedFile ?? null)
      },
      [setFieldValue]
    )

    const deleteImage = useCallback(() => {
      setFieldValue('image', null)
    }, [setFieldValue])

    const setVisibilityVal = useCallback(
      (v: string) => {
        setFieldValue('visibility', v)
      },
      [setFieldValue]
    )

    const dataInputs = (
      <div>
        <InputTextField
          autoUpdate={true}
          label="Title"
          placeholder=""
          getText={(text) => form.setFieldValue('title', text)}
          value={form.values.title}
          highlight={highlightMandatoryFields && !form.values.title}
          //error={form.errors.title}
          error="dsadasdsadsad"
        />
        <InputTextField
          autoUpdate={true}
          textarea={true}
          label="Description"
          placeholder=""
          value={form.values.description}
          getText={(text) => form.setFieldValue('description', text)}
          highlight={highlightMandatoryFields && !form.values.description}
          error={form.errors.description}
        />
        <Dropdown
          {...visibility}
          getValue={setVisibilityVal}
          label="Visibility"
          value={form.values.visibility}
          className="visibility-dropdown"
          highlight={highlightMandatoryFields && !form.values.visibility}
        />
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
          <PrimaryButton onClick={createCollection}>
            <Trans>Create collection</Trans>
          </PrimaryButton>
        </div>
      </div>
    )
  }
)

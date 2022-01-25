import { t, Trans } from '@lingui/macro'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import LinkIcon from '@material-ui/icons/Link'
import React, { useCallback, useRef, useState } from 'react'
import { withCtrl } from '../../../../lib/ctrl'
import { SelectOptions } from '../../../../lib/types'
import { useImageUrl } from '../../../../lib/useImageUrl'
import { ReactComponent as UploadFileIcon } from '../../../../static/icons/upload-file.svg'
import { ReactComponent as UploadImageIcon } from '../../../../static/icons/upload-image.svg'
import Card from '../../../atoms/Card/Card'
import {
  Dropdown,
  IconPill,
  IconTextOption,
  IconTextOptionProps,
  SimplePill,
  TextOption,
  TextOptionProps,
} from '../../../atoms/Dropdown/Dropdown'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import Modal from '../../../atoms/Modal/Modal'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import RoundButton from '../../../atoms/RoundButton/RoundButton'
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
import { VisibilityDropdown } from '../../../atoms/VisibilityDropdown/VisibilityDropdown'
import { useNewResourcePageCtx } from '../NewResource'
import { NewResourceFormValues } from '../types'
import './styles.scss'

// type SubStep = 'ChooseResource' | 'EditData'
export type UploadResourceProps = {
  categories: SelectOptions<TextOptionProps>
  licenses: SelectOptions<IconTextOptionProps>
}

const usingFields: (keyof NewResourceFormValues)[] = [
  'name',
  'description',
  'category',
  'license',
  'visibility',
  'image',
  'content',
]

export const UploadResource = withCtrl<UploadResourceProps>(
  ({ categories, licenses }) => {
    const { nextForm, form } = useNewResourcePageCtx()
    const isValid = usingFields.reduce(
      (valid, fldName) => valid && !form.errors[fldName],
      true
    )

    const [imageUrl] = useImageUrl(form.values.image)

    const contentIsFile = form.values.content instanceof File
    const contentName =
      form.values.content instanceof File
        ? form.values.content.name
        : form.values.content ?? ''
    const subStep =
      form.values.content && !form.errors.content
        ? 'EditData'
        : 'ChooseResource'

    const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
    const [isToDelete, setIsToDelete] = useState<boolean>(false)
    const [isToDrop, setIsToDrop] = useState<boolean>(false)

    const background = {
      backgroundImage: 'url(' + imageUrl + ')',
      backgroundSize: 'cover',
    }
    const addLinkFieldRef = useRef<HTMLInputElement>()
    const deleteImage = useCallback(() => {
      form.setFieldValue('image', undefined)
    }, [form])

    const deleteFileOrLink = useCallback(() => {
      form.setFieldValue('license', undefined)
      form.setFieldValue('content', undefined)
    }, [form])

    const dataInputs = (
      <div className="data-inputs">
        <InputTextField
          name="name"
          label="Title"
          value={form.values.name}
          placeholder=""
          disabled={subStep === 'ChooseResource'}
          edit
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.name}
        />
        <InputTextField
          name="description"
          textarea={true}
          label="Description"
          value={form.values.description}
          placeholder=""
          disabled={subStep === 'ChooseResource'}
          edit
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.description}
        />
        <div className="subject-and-visibility">
          <Dropdown
            name="category"
            value={form.values.category}
            onChange={form.handleChange}
            disabled={subStep === 'ChooseResource'}
            label="Subject"
            edit={subStep === 'EditData'}
            highlight={shouldShowErrors && !!form.errors.category}
            error={form.errors.category}
            pills={
              categories.selected && (
                <SimplePill
                  key={categories.selected.value}
                  value={categories.selected.value}
                  label={categories.selected.label}
                />
              )
            }
            className="subject-dropdown"
          >
            {categories.opts.map(({ label, value }) => (
              <TextOption key={value} value={value} label={label} />
            ))}
          </Dropdown>
          <VisibilityDropdown
            name="visibility"
            value={form.values.visibility}
            onChange={form.handleChange}
            disabled={subStep === 'ChooseResource'}
            edit={subStep === 'EditData'}
            label="Visibility"
            highlight={shouldShowErrors && !!form.errors.visibility}
            error={form.errors.visibility}
          />
        </div>
      </div>
    )

    const uploadImageRef = useRef<HTMLInputElement>(null)
    const selectImage = () => {
      uploadImageRef.current?.click()
    }

    const uploadFileRef = useRef<HTMLInputElement>(null)
    const selectFile = () => {
      uploadFileRef.current?.click()
    }

    const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
      setIsToDrop(false)

      // Prevent default behavior (Prevent file from being opened)
      e.preventDefault()

      let selectedFile

      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          const item = e.dataTransfer.items[i]
          if (item && item.kind === 'file') {
            var file = item.getAsFile()
            console.log('... file[' + i + '].name = ' + file?.name)
            file && (selectedFile = file)
            break
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const item = e.dataTransfer.files[i]
          console.log('... file[' + i + '].name = ' + item?.name)
          item && (selectedFile = item)
        }
      }

      if (subStep === 'ChooseResource') {
        form.setFieldValue('content', selectedFile)
      } else {
        form.setFieldValue('image', selectedFile)
      }
    }

    const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
      setIsToDrop(true)

      // Prevent default behavior (Prevent file from being opened)
      e.preventDefault()
    }

    return (
      <div className="upload-resource">
        {isToDelete && (
          <Modal
            title={t`Alert`}
            actions={[
              <PrimaryButton
                onClick={() => {
                  setShouldShowErrors(false)
                  form.resetForm()
                  setIsToDelete(false)
                }}
                color="red"
              >
                <Trans>Delete</Trans>
              </PrimaryButton>,
            ]}
            onClose={() => setIsToDelete(false)}
            style={{ maxWidth: '400px' }}
            className="delete-message"
          >
            <Trans>All the information will be deleted</Trans>
          </Modal>
        )}
        <div className="content">
          <div className="main-column">
            <div className="card-title">
              <Trans>Content</Trans>
            </div>
            <Card>
              <div className="main-container">
                {!imageUrl ? (
                  <div
                    className={`uploader ${isToDrop ? 'hover' : ''}`}
                    id="drop_zone"
                    onDrop={dropHandler}
                    onDragOver={dragOverHandler}
                    onDragLeave={() => setIsToDrop(false)}
                  >
                    {subStep === 'ChooseResource' ? (
                      <div className="file upload" onClick={selectFile}>
                        <input
                          ref={uploadFileRef}
                          type="file"
                          name="content"
                          onChange={({ target }) =>
                            form.setFieldValue('content', target.files?.[0])
                          }
                          hidden
                        />
                        <UploadFileIcon />
                        <span>
                          <Trans>Drop or click to upload a file!</Trans>
                        </span>
                      </div>
                    ) : (
                      <div className="image upload" onClick={selectImage}>
                        <input
                          ref={uploadImageRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.gif"
                          name="image"
                          onChange={({ target }) =>
                            form.setFieldValue('image', target.files?.[0])
                          }
                          hidden
                        />
                        <UploadImageIcon />
                        <span>
                          <Trans>Drop or click to upload an image!</Trans>
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="image-container" style={background}>
                    <RoundButton onClick={deleteImage} />
                  </div>
                )}
              </div>
              {subStep === 'ChooseResource' ? (
                <div className="bottom-container">
                  <InputTextField
                    className="link"
                    name="content"
                    placeholder={t`Paste or type a link`}
                    ref={addLinkFieldRef}
                    edit
                    action={
                      <PrimaryButton
                        onClick={() => {
                          form.setFieldValue(
                            'content',
                            addLinkFieldRef.current?.value
                          )
                        }}
                      >
                        <Trans>Add</Trans>
                      </PrimaryButton>
                    }
                    error={form.errors.content}
                  />
                </div>
              ) : (
                <div className="bottom-container">
                  <div
                    className={`uploaded-name subcontainer ${
                      contentIsFile ? 'file' : 'link'
                    }`}
                  >
                    <div className="content-icon">
                      {contentIsFile ? <InsertDriveFileIcon /> : <LinkIcon />}
                    </div>
                    <abbr className="scroll" title={contentName}>
                      {contentName}
                    </abbr>
                    <RoundButton onClick={deleteFileOrLink} />
                  </div>

                  {contentIsFile && (
                    <Dropdown
                      name="license"
                      className="license-dropdown"
                      onChange={form.handleChange}
                      value={form.values.license}
                      edit
                      highlight={shouldShowErrors && !!form.errors.license}
                      error={form.errors.license}
                      pills={
                        licenses.selected && (
                          <IconPill
                            key={licenses.selected.value}
                            icon={licenses.selected.icon}
                          />
                        )
                      }
                    >
                      {licenses.opts.map(({ icon, label, value }) => (
                        <IconTextOption
                          icon={icon}
                          label={label}
                          value={value}
                        />
                      ))}
                    </Dropdown>
                  )}
                </div>
              )}
            </Card>
            <div className="small-screen-details">{dataInputs}</div>
          </div>
          <div className="side-column">{dataInputs}</div>
        </div>
        <div className="footer">
          {subStep === 'EditData' && (
            <SecondaryButton
              onHoverColor="red"
              onClick={() => setIsToDelete(true)}
              color="grey"
            >
              <Trans>Delete</Trans>
            </SecondaryButton>
          )}
          <PrimaryButton
            disabled={subStep === 'ChooseResource'}
            onClick={
              !isValid
                ? () => {
                    setShouldShowErrors(true)
                    form.validateForm()
                  }
                : nextForm
            }
          >
            <Trans>Next</Trans>
          </PrimaryButton>
        </div>
      </div>
    )
  }
)

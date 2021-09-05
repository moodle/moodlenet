import { t, Trans } from '@lingui/macro'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import LinkIcon from '@material-ui/icons/Link'
import React, { useCallback, useState } from 'react'
import Card from '../../../components/atoms/Card/Card'
import DeleteButton from '../../../components/atoms/DeleteButton/DeleteButton'
import Dropdown from '../../../components/atoms/Dropdown/Dropdown'
import InputTextField from '../../../components/atoms/InputTextField/InputTextField'
import Modal from '../../../components/atoms/Modal/Modal'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
import { withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { ReactComponent as UploadFileIcon } from '../../../static/icons/upload-file.svg'
import { ReactComponent as UploadImageIcon } from '../../../static/icons/upload-image.svg'
import { canLoadUrlToImgTag, urlMatchesImage } from '../Ctrl/NewResourceCtrl'
import { DropdownField } from '../FieldsData'
import { NewResourceFormValues } from '../types'
import './styles.scss'
type UploadResourceState = 'ChooseResource' | 'EditData'

export type UploadResourceProps = {
  step: 'UploadResourceStep'
  state: UploadResourceState
  formBag: FormikBag<NewResourceFormValues>
  imageUrl: string
  categories: DropdownField
  licenses: DropdownField
  nextStep: (() => unknown) | undefined
  deleteContent: () => unknown
}

export const UploadResource = withCtrl<UploadResourceProps>(
  ({ formBag, state, imageUrl, licenses, categories, nextStep, deleteContent }) => {
    const [form, formAttrs] = formBag
    const [isToDelete, setIsToDelete] = useState<boolean>(false)
    const [isToDrop, setIsToDrop] = useState<boolean>(false)
    const setFieldValue = form.setFieldValue
    const background = {
      backgroundImage: 'url(' + imageUrl + ')',
      backgroundSize: 'cover',
    }

    const uploadFile = useCallback(
      (e?: React.ChangeEvent<HTMLInputElement>, file?: File) => {
        const selectedFile = file ? file : e?.currentTarget.files?.item(0)
        if (selectedFile) {
          setFieldValue('content', selectedFile)
          setFieldValue('contentType', 'File')
        }
      },
      [setFieldValue],
    )

    const uploadImage = useCallback(
      (e?: React.ChangeEvent<HTMLInputElement>, file?: File) => {
        const selectedFile = file ? file : e?.currentTarget.files?.item(0)
        setFieldValue('image', selectedFile ?? null)
      },
      [setFieldValue],
    )
    const setLicenseVal = useCallback(
      (v: string) => {
        setFieldValue('license', v)
      },
      [setFieldValue],
    )

    const deleteImage = useCallback(() => {
      setFieldValue('image', null)
    }, [setFieldValue])

    const setLink = useCallback(
      (link: string) => {
        setFieldValue('content', link)
        setFieldValue('contentType', 'Link')
        urlMatchesImage(link) && setFieldValue('image', link)
        !canLoadUrlToImgTag(link) && deleteImage()
      },
      [setFieldValue, deleteImage],
    )

    const deleteFileOrLink = useCallback(() => {
      setFieldValue('content', '')
      setFieldValue('contentType', 'Link')
    }, [setFieldValue])

    const setCategoryValue = useCallback(
      (v: string) => {
        setFieldValue('category', v)
      },
      [setFieldValue],
    )
    const dataInputs = (
      <div>
        <InputTextField
          autoUpdate={true}
          label="Title"
          placeholder=""
          disabled={state === 'ChooseResource'}
          getText={text => form.setFieldValue('title', text)}
          value={form.values.title}
        />
        <InputTextField
          autoUpdate={true}
          textarea={true}
          label="Description"
          placeholder=""
          disabled={state === 'ChooseResource'}
          value={form.values.description}
          getText={text => form.setFieldValue('description', text)}
        />
        <Dropdown
          {...categories}
          {...formAttrs.category}
          getValue={setCategoryValue}
          disabled={state === 'ChooseResource'}
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

    const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
      console.log('File(s) dropped')
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

      if (state === 'ChooseResource') {
        uploadFile(undefined, selectedFile)
      } else {
        uploadImage(undefined, selectedFile)
      }
    }

    const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
      console.log('File(s) in drop zone')
      setIsToDrop(true)

      // Prevent default behavior (Prevent file from being opened)
      e.preventDefault()
    }

    return (
      <div className="upload-resource">
        {isToDelete && (
          <Modal
            title={t`Alert`}
            actions={
              <PrimaryButton
                onClick={() => {
                  deleteContent()
                  setIsToDelete(false)
                }}
                color="red"
              >
                <Trans>Delete</Trans>
              </PrimaryButton>
            }
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
                    {state === 'ChooseResource' ? (
                      <div className="file upload" onClick={selectFile}>
                        <input id="uploadFile" type="file" name="myFile" onChange={uploadFile} hidden />
                        <UploadFileIcon />
                        <span>
                          <Trans>Drop or click to upload a file!</Trans>
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
                        <UploadImageIcon />
                        <span>
                          <Trans>Drop or click to upload an image!</Trans>
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="image-container" style={background}>
                    <DeleteButton onClick={deleteImage} />
                  </div>
                )}
              </div>
              {state === 'ChooseResource' ? (
                <div className="bottom-container">
                  <InputTextField
                    className="link subcontainer"
                    value={form.values.name}
                    placeholder={t`Paste or type a link`}
                    getText={setLink}
                    buttonName={t`Add`}
                  />
                </div>
              ) : (
                <div className="bottom-container">
                  <div className="uploaded-name subcontainer">
                    <div className="content-icon">
                      {form.values.contentType === 'File' ? <InsertDriveFileIcon /> : <LinkIcon />}
                    </div>
                    <abbr className="scroll" title={form.values.name}>
                      {form.values.name}
                    </abbr>
                    <DeleteButton onClick={deleteFileOrLink} />
                  </div>

                  <Dropdown
                    {...licenses}
                    getValue={setLicenseVal}
                    value={form.values.license}
                    highglight={!form.values.license}
                  />
                </div>
              )}
            </Card>
            <div className="small-screen-details">{dataInputs}</div>
          </div>
          <div className="side-column">{dataInputs}</div>
        </div>
        <div className="footer">
          {state === 'EditData' && (
            <SecondaryButton onHoverColor="red" onClick={() => setIsToDelete(true)} color="grey">
              <Trans>Delete</Trans>
            </SecondaryButton>
          )}
          <PrimaryButton disabled={!nextStep} onClick={nextStep}>
            <Trans>Next</Trans>
          </PrimaryButton>
        </div>
      </div>
    )
  },
)

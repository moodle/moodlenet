import { InsertDriveFile as InsertDriveFileIcon, Link as LinkIcon } from '@material-ui/icons'
import {
  ImageContainer,
  InputTextField,
  PrimaryButton,
  RoundButton,
} from '@moodlenet/component-library'
import { AssetInfo } from '@moodlenet/react-app/common'
import { FormikHandle, useImageUrl } from '@moodlenet/react-app/ui'
// import prettyBytes from 'pretty-bytes'
import { default as React, FC, useCallback, useEffect, useRef, useState } from 'react'
import { ResourceFormValues } from '../../../../common.mjs'
// import { withCtrl } from '../../../../lib/ctrl'
// import { SelectOptions } from '../../../../lib/types'
// import { useImageUrl } from '../../../../lib/useImageUrl'
import { ReactComponent as UploadFileIcon } from '../../../assets/icons/upload-file.svg'
import { ReactComponent as UploadImageIcon } from '../../../assets/icons/upload-image.svg'

// import InputTextField from '../../../atoms/InputTextField/InputTextField'
// import Modal from '../../../atoms/Modal/Modal'
// import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
// import RoundButton from '../../../atoms/RoundButton/RoundButton'
// import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
// import { VisibilityDropdown } from '../../../atoms/VisibilityDropdown/VisibilityDropdown'
// import { useNewResourcePageCtx } from '../NewResource'
// import { NewResourceFormValues } from '../types'
import './UploadResource.scss'

// type SubStep = 'AddFileOrLink' | 'AddImage'
export type UploadResourceProps = {
  fileMaxSize: number | null
  form: FormikHandle<ResourceFormValues>
  uploadProgress?: number
  imageOnClick?(): unknown
}

// const usingFields: (keyof NewResourceFormValues)[] = [
//   'name',
//   'description',
//   'category',
//   'license',
//   'visibility',
//   'image',
//   'content',
// ]

export const UploadResource: FC<UploadResourceProps> = ({
  fileMaxSize,
  form,
  uploadProgress,
  imageOnClick,
}) => {
  // const { nextForm, form } = useNewResourcePageCtx()
  // const isValid = usingFields.reduce(
  //   (valid, fldName) => valid && !form.errors[fldName],
  //   true
  // )

  const [imageUrl] = useImageUrl(form.values.image?.location)

  const contentIsFile = form.values.content instanceof File
  const contentName =
    form.values.content instanceof File ? form.values.content.name : form.values.content ?? ''

  const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
  // const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isToDrop, setIsToDrop] = useState<boolean>(false)

  const [subStep, setSubStep] = useState<'AddFileOrLink' | 'AddImage'>(
    form.values.content && !form.errors.content ? 'AddImage' : 'AddFileOrLink',
  )

  const [deleteFileLinkPressed, setDeleteFileLinkPressed] = useState(false)

  useEffect(() => {
    if (deleteFileLinkPressed) {
      setShouldShowErrors(false)
      setDeleteFileLinkPressed(false)
    }
    form.values.content && !form.errors.content && setShouldShowErrors(false)
    console.log('Commint here, content: ', form.values.content)
    console.log('Commint here, image: ', form.values.image?.location)

    setSubStep(form.values.content && !form.errors.content ? 'AddImage' : 'AddFileOrLink')
  }, [form, deleteFileLinkPressed, subStep, setSubStep, setDeleteFileLinkPressed])

  const addLinkFieldRef = useRef<HTMLInputElement>()

  const addLink = () =>
    form
      .setFieldValue('content', addLinkFieldRef.current?.value, true)
      .then(_ => setShouldShowErrors(!!_?.content))

  const deleteImage = useCallback(() => {
    setDeleteFileLinkPressed(true)
    form.setFieldValue('image', undefined)
  }, [form])

  const deleteFileOrLink = useCallback(() => {
    setDeleteFileLinkPressed(true)
    setSubStep('AddFileOrLink')
    form.setFieldValue('content', undefined)
    setShouldShowErrors(false)
  }, [form])

  const uploadImageRef = useRef<HTMLInputElement>(null)
  const selectImage = () => {
    uploadImageRef.current?.click()
  }

  const uploadFileRef = useRef<HTMLInputElement>(null)
  const selectFile = () => {
    uploadFileRef.current?.click()
  }

  const setContent = useCallback(
    (file: File | undefined) => {
      const isImage = file?.type.toLowerCase().startsWith('image')
      form.setFieldValue('content', file).then(errors => {
        if (errors?.content) {
          setShouldShowErrors(!!errors?.content)
        } else if (isImage) {
          if (file) {
            const fileAssetInfo: AssetInfo = { location: file }
            form.setFieldValue('image', fileAssetInfo)
          }
        }
      })
    },
    [form],
  )

  const dropHandler = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
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
            const file = item.getAsFile()
            // console.log('... file[' + i + '].name = ' + file?.name)
            file && (selectedFile = file)
            break
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const item = e.dataTransfer.files[i]
          // console.log('... file[' + i + '].name = ' + item?.name)
          item && (selectedFile = item)
        }
      }
      if (subStep === 'AddFileOrLink') {
        setContent(selectedFile)
      } else {
        if (selectedFile) {
          const fileAssetInfo: AssetInfo = { location: selectedFile }
          form.setFieldValue('image', fileAssetInfo)
        }
      }
    },
    [form, setContent, subStep],
  )

  const dragOverHandler = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    setIsToDrop(true)

    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault()
  }, [])

  const uploadImage = (file: File) => {
    const fileAssetInfo: AssetInfo = {
      location: file,
    }
    form.setFieldValue('image', fileAssetInfo)
  }

  const imageContainer = (
    <ImageContainer
      imageUrl={imageUrl}
      deleteImage={deleteImage}
      uploadImage={uploadImage}
      imageOnClick={imageOnClick}
    />
  )

  const uploadedNameBackground =
    contentIsFile && uploadProgress
      ? `linear-gradient(to right, #1a6aff33 ${uploadProgress}% , #ffffff00 ${
          uploadProgress + 3
        }%, #ffffff00 )`
      : 'none'

  const fileUploader = (
    <div
      className="file upload"
      onClick={selectFile}
      onKeyUp={e => e.key === 'Enter' && selectFile()}
      tabIndex={0}
    >
      <input
        ref={uploadFileRef}
        type="file"
        name="content"
        key="content"
        onChange={({ target }) => {
          setContent(target.files?.[0])
        }}
        hidden
      />
      <UploadFileIcon />
      <span>
        <span>Drop or click to upload a file!</span>
        <br />
        {fileMaxSize && (
          <span style={{ fontSize: '12px' }}>{/* Max size {prettyBytes(fileMaxSize)} */}</span>
        )}
      </span>
    </div>
  )

  const imageUploader = (
    <div
      className="image upload"
      onClick={selectImage}
      tabIndex={0}
      onKeyUp={e => e.key === 'Enter' && selectImage()}
    >
      <input
        ref={uploadImageRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        name="image"
        key="image"
        onChange={({ target }) => {
          const file = target.files?.[0]
          if (file) {
            const fileAssetInfo: AssetInfo = {
              location: file,
            }
            form.setFieldValue('image', fileAssetInfo)
          }
        }}
        hidden
      />
      <UploadImageIcon />
      <span>Drop or click to upload an image!</span>
    </div>
  )

  const uploader = (type: 'file' | 'image') => {
    return (
      <div
        className={`uploader ${isToDrop ? 'hover' : ''} 
            `}
        // ${form.values.content instanceof Blob && form.errors.content ? 'error' : ''}
        id="drop_zone"
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
        onDragLeave={() => setIsToDrop(false)}
      >
        {type === 'file' ? fileUploader : imageUploader}
      </div>
    )
  }

  return (
    <div className="upload-resource">
      <div className="main-container">
        {!form.values.content && uploader('file')}
        {form.values.content && !imageUrl && uploader('image')}
        {form.values.content && imageUrl && imageContainer}
      </div>
      <div className="bottom-container">
        {subStep === 'AddFileOrLink' ? (
          <InputTextField
            className="link"
            name="content"
            placeholder={`Paste or type a link`}
            ref={addLinkFieldRef}
            edit
            defaultValue={typeof form.values.content === 'string' ? form.values.content : ''}
            onChange={shouldShowErrors ? () => form.validateField('content') : undefined}
            onKeyDown={e => e.key === 'Enter' && addLink()}
            action={<PrimaryButton onClick={addLink}>Add</PrimaryButton>}
            error={
              shouldShowErrors && !(form.values.content instanceof Blob) && form.errors.content
            }
          />
        ) : (
          <div
            className={`uploaded-name subcontainer ${contentIsFile ? 'file' : 'link'}`}
            style={{ background: uploadedNameBackground }}
          >
            <div className="content-icon">
              {contentIsFile ? <InsertDriveFileIcon /> : <LinkIcon />}
            </div>
            <abbr className="scroll" title={contentName}>
              {contentName}
            </abbr>
            <RoundButton
              onClick={deleteFileOrLink}
              tabIndex={0}
              abbrTitle={contentIsFile ? 'Delete file' : 'Delete link'}
              onKeyUp={{ key: 'Enter', func: deleteFileOrLink }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

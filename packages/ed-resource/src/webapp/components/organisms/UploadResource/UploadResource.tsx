import { InsertDriveFile, Link as LinkIcon } from '@material-ui/icons'
import type { AddonItem } from '@moodlenet/component-library'
import {
  ErrorMessage,
  getPreviewFromUrl,
  ImageContainer,
  InputTextField,
  PrimaryButton,
  RoundButton,
} from '@moodlenet/component-library'
import type { AssetInfo, AssetInfoForm } from '@moodlenet/component-library/common'
import type { FormikHandle } from '@moodlenet/react-app/ui'
import { useImageUrl } from '@moodlenet/react-app/ui'
// import prettyBytes from 'pretty-bytes'
import type { default as React, FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactComponent as UploadFileIcon } from '../../../assets/icons/upload-file.svg'
import { ReactComponent as UploadImageIcon } from '../../../assets/icons/upload-image.svg'
import './UploadResource.scss'

// type SubStep = 'AddFileOrLink' | 'AddImage'
export type UploadResourceProps = {
  fileMaxSize: number | null
  contentForm: FormikHandle<{ content: File | string | undefined | null }>
  imageForm: FormikHandle<{ image: AssetInfoForm | undefined | null }>
  downloadFilename: string | null
  uploadOptionsItems: (AddonItem | null)[]
  contentType: 'file' | 'link' | null
  backupImage?: AssetInfo
  uploadProgress?: number
  shouldShowErrors?: boolean
  displayOnly?: boolean
}

export const UploadResource: FC<UploadResourceProps> = ({
  fileMaxSize,
  uploadOptionsItems,

  contentForm,
  imageForm,
  downloadFilename,
  contentType,
  backupImage,

  displayOnly,
  shouldShowErrors,
  uploadProgress,
}) => {
  const [imageUrl] = useImageUrl(
    imageForm.values.image?.location,
    displayOnly ? backupImage?.location : undefined,
  )
  const credits = imageForm.values.image?.credits ?? backupImage?.credits

  const contentIsFile = contentForm.values.content instanceof File || contentType === 'file'
  const contentName = downloadFilename
    ? downloadFilename
    : contentForm.values.content instanceof File
    ? contentForm.values.content.name
    : contentForm.values.content ?? ''

  const [isToDrop, setIsToDrop] = useState<boolean>(false)

  const [subStep, setSubStep] = useState<'AddFileOrLink' | 'AddImage'>(
    contentForm.values.content && !contentForm.errors.content ? 'AddImage' : 'AddFileOrLink',
  )
  const [showContentErrors, setShowContentErrors] = useState(false)
  const [showLinkErrors, setShowLinkErrors] = useState(false)
  const [showImageErrors, setShowImageErrors] = useState(false)

  const contentAvailable = contentForm.values.content && !contentForm.errors.content
  const imageAvailable = imageForm.values.image && !imageForm.errors.image

  const contentForm_setFieldValue = contentForm.setFieldValue
  const contentForm_setTouched = contentForm.setTouched
  const contentForm_validateForm = contentForm.validateForm

  const imageForm_setTouched = imageForm.setTouched
  const imageForm_setFieldValue = imageForm.setFieldValue
  const imageForm_validateForm = imageForm.validateForm

  useEffect(() => {
    setSubStep(
      contentForm.values.content && !contentForm.errors.content ? 'AddImage' : 'AddFileOrLink',
    )
  }, [contentForm, subStep, setSubStep])
  useEffect(() => {
    subStep === 'AddFileOrLink' && setShowImageErrors(false)
  }, [subStep])

  const addLinkFieldRef = useRef<HTMLInputElement>()

  const setImage = useCallback(
    (image: AssetInfoForm | undefined | null, fromContent?: boolean) => {
      imageForm_setFieldValue('image', image).then(errors => {
        if (fromContent && !!errors?.image) {
          imageForm_setFieldValue('image', null)
          return
        }
        setShowImageErrors(!!errors?.image)
        imageForm_validateForm()
        imageForm_setTouched({ image: true })
      })
    },
    [imageForm_setFieldValue, imageForm_setTouched, imageForm_validateForm],
  )

  useEffect(() => {
    subStep === 'AddFileOrLink' && imageForm.errors.image && setImage(null)
  }, [imageForm.errors.image, imageForm.values.image, setImage, subStep])

  const addLink = useCallback(() => {
    const link = addLinkFieldRef.current?.value
    contentForm_setFieldValue('content', link).then(errors => {
      setShowLinkErrors(!!errors?.content)
    })
  }, [contentForm_setFieldValue])

  const deleteImage = useCallback(() => {
    setImage(null)
    imageForm_setTouched({ image: true })
    imageForm_validateForm()
  }, [imageForm_setTouched, imageForm_validateForm, setImage])

  const deleteFileOrLink = useCallback(() => {
    setSubStep('AddFileOrLink')
    contentForm_setFieldValue('content', null)
    contentForm_setTouched({ content: true })
    contentForm_validateForm()
  }, [contentForm_setFieldValue, contentForm_setTouched, contentForm_validateForm])

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
      contentForm_setFieldValue('content', file).then(errors => {
        setShowContentErrors(!!errors?.content)
        if (!errors?.content && file && isImage) {
          setImage({ location: file, credits: null }, true)
        }
        imageForm_setTouched({ image: true })
      })
    },
    [contentForm_setFieldValue, imageForm_setTouched, setImage],
  )

  const contentValue =
    typeof contentForm.values.content === 'string'
      ? contentForm.values.content
      : contentForm.values.content
      ? contentForm.values.content.name
      : null

  // const embed = contentValue && checkIfURL(contentValue) ? getPreviewFromUrl(contentValue) : null
  const embed = contentValue
    ? getPreviewFromUrl(contentValue)
    : typeof contentForm.values.content === 'string'
    ? getPreviewFromUrl(contentForm.values.content)
    : null

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
            file && (selectedFile = file)
            break
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const item = e.dataTransfer.files[i]
          item && (selectedFile = item)
        }
      }
      if (subStep === 'AddFileOrLink') {
        setContent(selectedFile)
      } else {
        if (selectedFile) {
          setImage({ location: selectedFile, credits: null })
          imageForm_validateForm()
          imageForm_setTouched({ image: true })
        }
      }
    },
    [imageForm_setTouched, imageForm_validateForm, setContent, setImage, subStep],
  )

  const dragOverHandler = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    setIsToDrop(true)

    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault()
  }, [])

  const imageRef = useRef<HTMLDivElement>(null)

  // const shouldOpenImage =
  //   contentForm.values.content === imageForm.values.image || contentType === 'file'

  const imageContainer = (
    <ImageContainer
      imageUrl={imageUrl}
      credits={credits}
      ref={imageRef}
      deleteImage={deleteImage}
      uploadImage={file => setImage({ location: file, credits: null })}
      displayOnly={displayOnly}
      link={
        contentType === 'link' && typeof contentForm.values.content === 'string'
          ? contentForm.values.content
          : undefined
      }
    />
  )

  const simpleImageContainer = (
    <ImageContainer
      imageUrl={imageUrl}
      credits={credits}
      ref={imageRef}
      displayOnly={displayOnly}
      style={{ maxHeight: backupImage ? '200px' : 'initial', overflow: 'hidden' }}
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
      onClick={e => {
        e.stopPropagation()
        selectFile()
      }}
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
      onClick={e => {
        e.stopPropagation()
        selectImage()
      }}
      tabIndex={0}
      onKeyUp={e => e.key === 'Enter' && selectImage()}
      // style={{ ...uploadHeight }}
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
            setImage({ location: file, credits: null })
          }
        }}
        hidden
      />
      <UploadImageIcon />
      <span>Drop or click to upload an image!</span>
    </div>
  )

  const uploader = (type: 'file' | 'image') => {
    const updatedUploadOptionsItems = [
      type === 'file' ? fileUploader : imageUploader,
      ...(uploadOptionsItems ?? []),
    ].filter((item): item is AddonItem | JSX.Element => !!item)

    return [
      <>
        <div
          className={`uploader ${isToDrop ? 'hover' : ''} ${
            (shouldShowErrors || showContentErrors || showImageErrors) &&
            (contentForm.errors.content || imageForm.errors.image)
              ? 'show-error'
              : ''
          }
        `}
          //  ${contentForm.values.content instanceof Blob && form.errors.content ? 'error' : ''}
          id="drop_zone"
          onClick={type === 'file' ? selectFile : selectImage}
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
          onDragLeave={() => setIsToDrop(false)}
        >
          {updatedUploadOptionsItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
        </div>
        {showImageErrors && imageForm.errors.image && (
          <ErrorMessage error={imageForm.errors.image} />
        )}
      </>,
    ]
  }

  const uploaderDiv = (
    <>
      {subStep === 'AddFileOrLink' && !displayOnly && uploader('file')}
      {subStep === 'AddImage' && !displayOnly && (embed ?? (!imageAvailable && uploader('image')))}
      {contentAvailable && displayOnly && (embed ?? (!imageAvailable && simpleImageContainer))}
      {contentAvailable && (embed ? undefined : imageAvailable && imageContainer)}
    </>
  )

  return (
    <div className="upload-resource">
      <div className={`main-container `}>{uploaderDiv}</div>
      {!displayOnly && (
        <div className="bottom-container">
          {subStep === 'AddFileOrLink' ? (
            <InputTextField
              className="link"
              name="content"
              placeholder={`Paste or type a link`}
              ref={addLinkFieldRef}
              edit
              defaultValue={
                typeof contentForm.values.content === 'string' ? contentForm.values.content : ''
              }
              onChange={shouldShowErrors ? () => contentForm.validateField('content') : undefined}
              onKeyDown={e => e.key === 'Enter' && addLink()}
              rightSlot={<PrimaryButton onClick={addLink}>Add</PrimaryButton>}
              error={
                (shouldShowErrors || showContentErrors || showLinkErrors) &&
                contentForm.errors.content
              }
            />
          ) : (
            <div
              className={`uploaded-name subcontainer ${contentIsFile ? 'file' : 'link'}`}
              style={{ background: uploadedNameBackground }}
            >
              <div className="content-icon">
                {contentIsFile ? <InsertDriveFile /> : <LinkIcon />}
              </div>
              <abbr className="scroll" title={contentName}>
                {contentName}
              </abbr>
              <RoundButton
                onClick={deleteFileOrLink}
                tabIndex={0}
                abbrTitle={contentIsFile ? 'Delete file' : 'Delete link'}
                onKeyUp={e => e.key === 'Enter' && deleteFileOrLink()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

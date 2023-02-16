import { ImageContainer } from '@moodlenet/component-library'
import { AssetInfo } from '@moodlenet/react-app/common'
import { FormikHandle, useImageUrl } from '@moodlenet/react-app/ui'
// import prettyBytes from 'pretty-bytes'
import { default as React, FC, useCallback, useEffect, useRef, useState } from 'react'
import { CollectionFormValues } from '../../../../common.mjs'
// import { withCtrl } from '../../../../lib/ctrl'
// import { SelectOptions } from '../../../../lib/types'
// import { useImageUrl } from '../../../../lib/useImageUrl'
import { ReactComponent as UploadImageIcon } from '../../../assets/icons/upload-image.svg'

// import InputTextField from '../../../atoms/InputTextField/InputTextField'
// import Modal from '../../../atoms/Modal/Modal'
// import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
// import RoundButton from '../../../atoms/RoundButton/RoundButton'
// import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
// import { VisibilityDropdown } from '../../../atoms/VisibilityDropdown/VisibilityDropdown'
// import { useNewCollectionPageCtx } from '../NewCollection'
// import { NewCollectionFormValues } from '../types'
import './UploadImage.scss'

// type SubStep = 'AddFileOrLink' | 'AddImage'
export type UploadImageProps = {
  form: FormikHandle<CollectionFormValues>
  imageOnClick?: () => unknown
}

// const usingFields: (keyof NewCollectionFormValues)[] = [
//   'name',
//   'description',
//   'category',
//   'license',
//   'visibility',
//   'image',
//   'content',
// ]

export const UploadImage: FC<UploadImageProps> = ({ form, imageOnClick }) => {
  // const { nextForm, form } = useNewCollectionPageCtx()
  // const isValid = usingFields.reduce(
  //   (valid, fldName) => valid && !form.errors[fldName],
  //   true
  // )

  const [imageUrl] = useImageUrl(form.values.image?.location)

  // const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isToDrop, setIsToDrop] = useState<boolean>(false)

  const [subStep, setSubStep] = useState<'AddFileOrLink' | 'AddImage'>(
    form.values.content && !form.errors.content ? 'AddImage' : 'AddFileOrLink',
  )

  const [deleteFileLinkPressed, setDeleteFileLinkPressed] = useState(false)

  useEffect(() => {
    if (deleteFileLinkPressed) {
      setDeleteFileLinkPressed(false)
    }

    setSubStep(form.values.content && !form.errors.content ? 'AddImage' : 'AddFileOrLink')
  }, [
    form.values.content,
    form.errors.content,
    deleteFileLinkPressed,
    subStep,
    setSubStep,
    setDeleteFileLinkPressed,
  ])

  const deleteImage = useCallback(() => {
    setDeleteFileLinkPressed(true)
    form.setFieldValue('image', undefined)
  }, [form])

  const uploadImageRef = useRef<HTMLInputElement>(null)
  const selectImage = () => {
    uploadImageRef.current?.click()
  }

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
      const fileAssetInfo: AssetInfo = { location: selectedFile ?? '' }
      form.setFieldValue('image', fileAssetInfo)
    },
    [form],
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
      imageCover
      imageOnClick={imageOnClick}
    />
  )

  return (
    <div className="upload-image">
      {!imageUrl ? (
        <div className={`uploader `}>
          <div
            className={`image upload ${isToDrop ? 'hover' : ''} ${
              form.values.content instanceof Blob && form.errors.content ? 'error' : ''
            }`}
            onClick={selectImage}
            id="drop_zone"
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
            onDragLeave={() => setIsToDrop(false)}
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
        </div>
      ) : (
        imageContainer
      )}
    </div>
  )
}

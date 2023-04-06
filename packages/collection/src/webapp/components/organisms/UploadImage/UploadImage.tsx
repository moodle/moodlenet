import { ImageContainer } from '@moodlenet/component-library'
import { FormikHandle, useImageUrl } from '@moodlenet/react-app/ui'
// import prettyBytes from 'pretty-bytes'
import { default as React, FC, useCallback, useRef, useState } from 'react'
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
  imageForm: FormikHandle<{ image: File | null }>
  imageUrl: string | undefined
  imageOnClick?: () => void
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

export const UploadImage: FC<UploadImageProps> = ({ imageForm, imageUrl, imageOnClick }) => {
  // const { nextForm, imageForm } = useNewCollectionPageCtx()
  // const isValid = usingFields.reduce(
  //   (valid, fldName) => valid && !imageForm.errors[fldName],
  //   true
  // )

  const [image] = useImageUrl(imageUrl, imageForm.values.image)

  // const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isToDrop, setIsToDrop] = useState<boolean>(false)

  const deleteImage = useCallback(() => {
    imageForm.setFieldValue('image', undefined)
  }, [imageForm])

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
      imageForm.setFieldValue('image', selectedFile)
    },
    [imageForm],
  )

  const dragOverHandler = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    setIsToDrop(true)

    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault()
  }, [])

  const uploadImage = (file: File) => {
    imageForm.setFieldValue('image', file)
  }

  const imageContainer = (
    <ImageContainer
      imageUrl={image}
      deleteImage={deleteImage}
      uploadImage={uploadImage}
      imageCover
      imageOnClick={imageOnClick}
    />
  )

  return (
    <div className="upload-image">
      {!image ? (
        <div className={`uploader `}>
          <div
            className={`image upload ${isToDrop ? 'hover' : ''} ${
              imageForm.values.image instanceof Blob && imageForm.errors.image ? 'error' : ''
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
                  imageForm.setFieldValue('image', file)
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

import { useState } from 'react'
import { useAssetUploaderHandler } from '../../../lib/client/useAssetUploader'
import { ReactComponent as UploadImageIcon } from '../../lib/assets/icons/upload-image.svg'
import ImageContainer from '../../molecules/ImageContainer/ImageContainer'
import './UploadImage.scss'
export type uploadImageProps = {
  useAssetUploaderHandler: useAssetUploaderHandler
  displayOnly?: boolean
  deleteImage?: () => unknown
}

export function UploadImage({ useAssetUploaderHandler, displayOnly }: uploadImageProps) {
  const [[imageUrl], openFileDialog /* submit */, , uploaderState, dropHandlers, dispatch] = useAssetUploaderHandler

  const [asset] = uploaderState.assets
  const credits = asset?.type === 'external' ? asset.credits : undefined

  const imageContainer = (
    <ImageContainer
      imageUrl={imageUrl}
      credits={credits}
      deleteImage={() => dispatch({ type: 'select', files: null })}
      displayOnly={displayOnly}
      overlayCredits={true}
    />
  )

  const [isToDrop, setIsToDrop] = useState<boolean>(false)
  return (
    <div className="upload-image">
      {/* {modals}
      {snackbars} */}
      {!imageUrl && !displayOnly ? (
        <div className={`uploader `}>
          <div
            className={`image upload ${isToDrop ? 'hover' : ''} ${uploaderState.error ? 'error' : ''}`}
            onClick={openFileDialog}
            {...dropHandlers}
            onDragOver={e => {
              // Prevent default behavior (Prevent file from being opened)
              setIsToDrop(true)
              e.preventDefault()
            }}
            onDragLeave={() => setIsToDrop(false)}
            tabIndex={0}
            onKeyUp={e => e.key === 'Enter' && openFileDialog()}
          >
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

// const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
// const [imageErrors, setImageErrors] = useState<undefined | string>(undefined)

// const modals = [
//   isShowingImage && imageUrl && (
//     <Modal
//       className="image-modal"
//       closeButton={false}
//       onClose={() => setIsShowingImage(false)}
//       style={{
//         maxWidth: '90%',
//         maxHeight: 'calc(90% + 20px)',
//         // maxHeight: specificContentType !== '' ? 'calc(90% + 20px)' : '90%',
//       }}
//       key="image-modal"
//     >
//       <img src={imageUrl} alt="Resource" />
//       {/* {getImageCredits(form.values.image)} */}
//     </Modal>
//   ),
// ]

// const snackbars = [
//   imageErrors && (
//     <Snackbar type="error" position="bottom" autoHideDuration={3000} showCloseButton={false}>
//       {imageErrors}
//     </Snackbar>
//   ),
// ]

import { useState } from 'react'
import { useAssetUploaderHandler } from '../../../lib/client/useAssetUploader'
import { ReactComponent as UploadImageIcon } from '../../lib/assets/icons/upload-image.svg'
import { ReactComponent as UploadFileIcon } from '../../lib/assets/icons/upload-file.svg'
import ImageContainer from '../../molecules/ImageContainer/ImageContainer'
import './DropUpload.scss'
import { unreachable_never } from '@moodle/lib-types'
export type uploadImageProps = {
  useAssetUploaderHandler: useAssetUploaderHandler
  displayOnly?: boolean
  deleteImage?: () => unknown
}

export function DropUpload({ useAssetUploaderHandler, displayOnly }: uploadImageProps) {
  const {
    current,
    openFileDialog,
    state,
    dropHandlers,
    opts: { type },
    select,
  } = useAssetUploaderHandler

  const credits = current?.type === 'asset' && current?.asset.type === 'external' ? current.asset.credits : undefined

  const viewerContainer =
    type === 'webImage' ? (
      <ImageContainer
        imageUrl={current?.url}
        credits={credits}
        deleteImage={() => select(null)}
        displayOnly={displayOnly}
        overlayCredits={true}
      />
    ) : (
      <span>
        {current.type === 'asset'
          ? current.asset.type === 'external'
            ? current.asset.url
            : current.asset.type === 'local'
              ? current.asset.name
              : current.asset.type === 'none'
                ? ''
                : unreachable_never(current.asset)
          : current.type === 'file'
            ? current.file.name
            : unreachable_never(current)}
      </span>
    )
  const promptContent =
    type === 'webImage' ? (
      <>
        <UploadImageIcon />
        <span>Drop or click to upload an image!</span>
      </>
    ) : (
      <>
        <UploadFileIcon />
        <span>Drop or click to upload a File!</span>
      </>
    )

  const [isToDrop, setIsToDrop] = useState<boolean>(false)
  const uploadErrored = state.uploadStatus?.status === 'error'
  return (
    <div className="upload-file">
      {/* {modals}
      {snackbars} */}
      {!current?.url && !displayOnly ? (
        <div className={`uploader `}>
          <div
            className={`file upload ${isToDrop ? 'hover' : ''} ${uploadErrored ? 'error' : ''}`}
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
            {promptContent}
          </div>
        </div>
      ) : (
        viewerContainer
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

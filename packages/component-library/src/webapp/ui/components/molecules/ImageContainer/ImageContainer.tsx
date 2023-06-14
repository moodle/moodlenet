import type { CSSProperties } from 'react'
import { forwardRef, useRef } from 'react'
import { useForwardedRef } from '../../../lib/useForwardedRef.mjs'
import Loading from '../../atoms/Loading/Loading.js'
import RoundButton from '../../atoms/RoundButton/RoundButton.js'
import './ImageContainer.scss'

export type ImageContainerProps = {
  uploadImage?(image: File): unknown
  deleteImage?: () => unknown
  imageUrl?: string
  style?: CSSProperties
  link?: string
  imageCover?: boolean
  displayOnly?: boolean
  imageOnClick?: () => unknown
  isUploading?: boolean
  // contentUrl?: string
}

export const ImageContainer = forwardRef<HTMLDivElement | null | undefined, ImageContainerProps>(
  (props, forwRef) => {
    const {
      uploadImage,
      deleteImage,
      imageCover,
      imageUrl,
      style,
      link,
      // contentUrl,
      displayOnly,
      imageOnClick,
      isUploading,
    } = props

    const imageContainerRef = useForwardedRef(forwRef)
    const uploadImageRef = useRef<HTMLInputElement>(null)
    // const selectImage = () => {
    //   uploadImageRef.current?.click()
    // }

    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.currentTarget.files?.item(0)
      selectedFile && uploadImage && uploadImage(selectedFile)
    }

    const imageDiv = imageCover ? (
      <img
        className="image"
        src={imageUrl}
        alt="Background"
        onClick={imageOnClick}
        // style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
        style={{ maxHeight: 'fit-content', pointerEvents: imageOnClick ? 'auto' : 'none' }}
      />
    ) : (
      // <div
      //   className="image"
      //   style={{ backgroundImage: `url(${imageUrl})` }}
      //   onClick={imageOnClick}
      // />
      <img
        className="image"
        src={imageUrl}
        alt="Background"
        onClick={imageOnClick}
        // style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
        style={{ maxHeight: 'fit-content', pointerEvents: imageOnClick ? 'auto' : 'none' }}
      />
    )

    const uploading = (
      <div className="uploading">
        <Loading type="uploading" color="gray" size="70px" />
      </div>
    )

    return (
      <div
        className="image-container"
        style={style}
        ref={imageContainerRef as React.RefObject<HTMLDivElement>}
      >
        {isUploading ? (
          uploading
        ) : link ? (
          <a href={link} target="_blank" rel="noreferrer">
            {imageDiv}
          </a>
        ) : (
          <>{imageDiv}</>
        )}
        {/* {getImageCredits(form.values.image)} */}
        <div className="image-actions">
          <input
            ref={uploadImageRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
            onChange={handleUploadImage}
            hidden
          />
          {/* {canSearchImage && (
                <RoundButton
                  className={`search-image-button ${form.isSubmitting ? 'disabled' : ''} ${
                    autoImageAdded ? 'highlight' : ''
                  }`}
                  type="search"
                  abbrTitle={`Search for an image`}
                  onClick={() => setIsSearchingImage(true)}
                />
              )} */}
          {/* <RoundButton
        className={`change-image-button`}
        type="upload"
        abbrTitle={`Upload an image`}
        onClick={selectImage}
      /> */}
          {!displayOnly && deleteImage && (
            <RoundButton
              className={`delete-image`}
              type="cross"
              abbrTitle={`Delete image`}
              onClick={deleteImage}
            />
          )}
        </div>
      </div>
    )
  },
)

ImageContainer.defaultProps = {}
ImageContainer.displayName = 'ImageContainer'

export default ImageContainer

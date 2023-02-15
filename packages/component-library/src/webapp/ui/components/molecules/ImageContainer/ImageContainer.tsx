import { FC, useRef } from 'react'
import RoundButton from '../../atoms/RoundButton/RoundButton.js'
import './ImageContainer.scss'

export type ImageContainerProps = {
  uploadImage(image: File): unknown
  deleteImage: () => unknown
  imageUrl?: string
  link?: string
  contentUrl?: string
  imageCover?: boolean
  imageOnClick?: () => unknown
}

export const ImageContainer: FC<ImageContainerProps> = ({
  uploadImage,
  deleteImage,
  imageCover,
  imageUrl,
  link,
  contentUrl,
  imageOnClick,
}) => {
  const uploadImageRef = useRef<HTMLInputElement>(null)
  // const selectImage = () => {
  //   uploadImageRef.current?.click()
  // }

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files?.item(0)
    selectedFile && uploadImage(selectedFile)
  }

  const imageDiv = imageCover ? (
    <div className="image" style={{ backgroundImage: `url(${imageUrl})` }} onClick={imageOnClick} />
  ) : (
    <img
      className="image"
      src={imageUrl}
      alt="Background"
      // {...(contentType === 'file' && {
      //   onClick: () => setIsShowingImage(true),
      // })}
      onClick={imageOnClick}
      // style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
      style={{ maxHeight: 'fit-content' }}
    />
  )

  return (
    <div className="image-container">
      {link ? (
        <a href={contentUrl} target="_blank" rel="noreferrer">
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
        <RoundButton
          className={`delete-image`}
          type="cross"
          abbrTitle={`Delete image`}
          onClick={deleteImage}
        />
      </div>
    </div>
  )
}

ImageContainer.defaultProps = {}

export default ImageContainer

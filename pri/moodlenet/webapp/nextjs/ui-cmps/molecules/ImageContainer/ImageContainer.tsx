'use client'
import type { CSSProperties } from 'react'
import { forwardRef, useRef, useState } from 'react'
import type { Credits } from '../../../../../common'
import { useForwardedRef } from '../../../lib/useForwardedRef'
import Modal from '../../atoms/Modal/Modal'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import './ImageContainer.scss'

export type ImageContainerProps = {
  uploadImage?(image: File): unknown
  deleteImage?: () => unknown
  imageUrl?: string | null
  credits?: Credits | null
  style?: CSSProperties
  link?: string
  displayOnly?: boolean
  overlayCredits?: boolean
  // isUploading?: boolean
}

export const ImageContainer = forwardRef<HTMLDivElement | null | undefined, ImageContainerProps>(
  (props, forwRef) => {
    const {
      uploadImage,
      deleteImage,
      imageUrl,
      style,
      link,
      displayOnly,
      credits,
      overlayCredits,
      // isUploading
    } = props

    const imageContainerRef = useForwardedRef(forwRef)
    const uploadImageRef = useRef<HTMLInputElement>(null)
    const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
    // const selectImage = () => {
    //   uploadImageRef.current?.click()
    // }

    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.currentTarget.files?.item(0)
      selectedFile && uploadImage && uploadImage(selectedFile)
    }

    const imageDiv = imageUrl && (
      <img
        className="image"
        src={imageUrl}
        alt="Background"
        onClick={() => (link ? undefined : setIsShowingImage(true))}
        style={{ maxHeight: 'fit-content', pointerEvents: displayOnly ? 'auto' : 'none' }}
      />
    )

    const imageCredits = credits && (
      <div className={`image-credits ${overlayCredits ? 'overlay' : ''}`}>
        Photo by
        <a href={credits.owner.url} target="_blank" rel="noreferrer">
          {credits.owner.name}
        </a>
        on
        {
          <a href={credits.provider?.url} target="_blank" rel="noreferrer">
            {credits.provider?.name}
          </a>
        }
      </div>
    )

    // const uploading = (
    //   <div className="uploading">
    //     <Loading type="uploading" color="gray" size="70px" />
    //   </div>
    // )

    const modals = [
      isShowingImage && imageUrl && (
        <Modal
          className="image-modal"
          closeButton={false}
          onClose={() => setIsShowingImage(false)}
          style={{
            maxWidth: '90%',
            maxHeight: 'calc(90% + 20px)',
            // maxHeight: specificContentType !== '' ? 'calc(90% + 20px)' : '90%',
          }}
          key="image-modal"
        >
          <img src={imageUrl} alt="Resource" />
          {imageCredits}
        </Modal>
      ),
    ]

    return (
      <div
        className="image-container"
        style={style}
        ref={imageContainerRef as React.RefObject<HTMLDivElement>}
      >
        {modals}
        {
          // isUploading ? (
          //   uploading
          // ) :
          link ? (
            <a href={link} target="_blank" rel="noreferrer">
              {imageDiv}
            </a>
          ) : (
            <>{imageDiv}</>
          )
        }
        {imageCredits}
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
          {!displayOnly && imageUrl && deleteImage && (
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

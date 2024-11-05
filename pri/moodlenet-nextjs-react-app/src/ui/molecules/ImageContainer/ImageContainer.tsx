'use client'
import { contentCredits } from '@moodle/module/content'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import { Modal } from '../../atoms/Modal/Modal'
import { RoundButton } from '../../atoms/RoundButton/RoundButton'
import './ImageContainer.scss'

export type ImageContainerProps = {
  deleteImage?: () => unknown
  imageUrl?: string | null
  credits?: contentCredits | null
  style?: CSSProperties
  link?: string
  displayOnly?: boolean
  overlayCredits?: boolean
  // isUploading?: boolean
}

export function ImageContainer(props: ImageContainerProps) {
  const {
    deleteImage,
    imageUrl,
    style,
    link,
    displayOnly,
    credits,
    overlayCredits = true,
    // isUploading
  } = props

  const [isShowingImage, setIsShowingImage] = useState<boolean>(false)

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
    <div className="image-container" style={style}>
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
        {!displayOnly && imageUrl && deleteImage && (
          <RoundButton className={`delete-image`} type="cross" abbrTitle={`Delete image`} onClick={deleteImage} />
        )}
      </div>
    </div>
  )
}

export default ImageContainer

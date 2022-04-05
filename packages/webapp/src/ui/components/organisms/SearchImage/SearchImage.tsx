import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Basic } from 'unsplash-js/dist/methods/photos/types'
import { getUnsplashImages } from '../../../../helpers/utilities'
import Modal from '../../atoms/Modal/Modal'
import './styles.scss'

export type SearchImageProps = {
  title?: string
  actions?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  closeButton?: boolean

  setImage: (photo: Basic | undefined) => void
  setUnsplashImage: React.Dispatch<React.SetStateAction<Basic | undefined>>
  onClose: () => void
}

// const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

export const SearchImage: React.FC<SearchImageProps> = ({
  onClose,
  setImage,
  setUnsplashImage,
  // title,
  // actions,
  // style,
  // className,
  // closeButton,
  // children,
}) => {
  const [unsplashImages, setUnsplashImages] = useState<Basic[]>()
  const [column1, setColumn1] = useState<ReactElement[] | undefined>()
  const [column2, setColumn2] = useState<ReactElement[] | undefined>()
  const getNewUnsplashImages = () => {
    const query = 'nature'
    const photos = getUnsplashImages(query)
    photos.then((photos) => photos && setUnsplashImages(photos))
  }

  getNewUnsplashImages()
  const getImagesColumn = useCallback(
    (photos: Basic[] | undefined) => {
      return photos?.map((photo, i) => (
        <div className="image-container">
          <div
            className="image"
            onClick={() => {
              setUnsplashImage(photo)
              setImage(undefined)
              setImage(photo)
              onClose()
            }}
            key={i}
          >
            <img src={`${(photo as Basic).urls.small}`} alt="" />
            <div className="active-overlay" />
          </div>
        </div>
      ))
    },
    [setUnsplashImage, setImage, onClose]
  )
  useEffect(() => {
    let totalHeight = 0
    unsplashImages?.map((photo) => {
      return (totalHeight += photo.height / (photo.width / 100))
    })
    const columnMaxHeight = totalHeight / 2
    let i = 0
    let height = 0
    unsplashImages?.every((photo) => {
      height += photo.height / (photo.width / 100)
      i++
      if (height < columnMaxHeight) return true
      return false
    })
    setColumn1(getImagesColumn(unsplashImages?.slice(0, i)))
    setColumn2(getImagesColumn(unsplashImages?.slice(i)))
  }, [unsplashImages, getImagesColumn])

  return (
    <Modal className="search-image" onClose={onClose} closeButton={false}>
      <div className="images-container">
        <div className="column-1">{column1}</div>
        <div className="column-2">{column2}</div>
      </div>
    </Modal>
  )
}
SearchImage.defaultProps = {
  className: '',
  closeButton: true,
}

export default SearchImage

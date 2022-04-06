import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Basic } from 'unsplash-js/dist/methods/photos/types'
import { getUnsplashImages } from '../../../../helpers/utilities'
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg'
import InputTextField from '../../atoms/InputTextField/InputTextField'
import Modal from '../../atoms/Modal/Modal'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import './styles.scss'

export type SearchImageProps = {
  setImage: (photo: Basic | undefined) => void
  setUnsplashImage: React.Dispatch<React.SetStateAction<Basic | undefined>>
  onClose: () => void
}

// const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

export const SearchImage: React.FC<SearchImageProps> = ({
  onClose,
  setImage,
  setUnsplashImage,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [tmpSearchQuery, setTmpSearchQuery] = useState('')
  const [unsplashImages, setUnsplashImages] = useState<Basic[]>()
  const [column1, setColumn1] = useState<ReactElement[] | undefined>()
  const [column2, setColumn2] = useState<ReactElement[] | undefined>()

  const searchUnsplashImages = (query: string) => {
    setSearchQuery(query)
    const photos = getUnsplashImages(query)
    photos.then((photos) => photos && setUnsplashImages(photos))
  }

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
            <a className="credits" href={photo.user.links.portfolio}>
              {photo.user.first_name} {photo.user.last_name}
            </a>
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      searchUnsplashImages(tmpSearchQuery)
    }
  }

  const sampleQuerySet = () => {
    const querySet = [
      'abstract',
      'animal',
      'architecture',
      'art',
      'interior',
      'business',
      'colorful',
      'food',
      'interior',
      'minimal',
      'nature',
      'plant',
      'portrait',
      'space',
      'technology',
      'texture',
      'wallpaper',
    ]
    return querySet.map((query) => {
      return (
        <PrimaryButton
          color="card"
          onClick={() => {
            setSearchQuery(query)
            searchUnsplashImages(query)
          }}
        >
          {query}
        </PrimaryButton>
      )
    })
  }

  const searchBox = (
    <div className="image-search-box">
      <InputTextField
        edit={true}
        onKeyDown={handleKeyDown}
        value={tmpSearchQuery}
        onChange={(v) => setTmpSearchQuery(v.currentTarget.value)}
      />
      <PrimaryButton
        className="search-button"
        color="blue"
        disabled={tmpSearchQuery === ''}
        onClick={() => searchUnsplashImages(tmpSearchQuery)}
      >
        <SearchIcon />
      </PrimaryButton>
    </div>
  )

  return (
    <Modal className="search-image" onClose={onClose} closeButton={false}>
      {searchBox}
      {searchQuery === '' ? (
        <div className="sample-queries-container">{sampleQuerySet()}</div>
      ) : (
        <div className="images-container">
          <div className="column-1">{column1}</div>
          <div className="column-2">{column2}</div>
        </div>
      )}
    </Modal>
  )
}
SearchImage.defaultProps = {}

export default SearchImage

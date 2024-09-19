'use client'
// import { Trans } from '@lingui/macro'
// import { Search } from '@mui/icons-material'
import type React from 'react'
import type { ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { CreditedImage } from '../../../../../../common/types.mjs'
import InputTextField from '../../atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../atoms/PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../../atoms/SecondaryButton/SecondaryButton'
import { SecondaryButton } from '../../atoms/SecondaryButton/SecondaryButton'
import Loading from '../../atoms/Loading/Loading'
import Modal from '../../atoms/Modal/Modal'
// import { useUnsplash } from '../../../../helpers/unsplash'
// import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg'
// import { CreditedImage } from '../../../types'
// import InputTextField from '../../atoms/InputTextField/InputTextField'
// import Loading from '../../atoms/Loading/Loading'
// import Modal from '../../atoms/Modal/Modal'
// import { PrimaryButton } from '../../atoms/PrimaryButton/PrimaryButton'
// import { SecondaryButton } from '../../atoms/SecondaryButton/SecondaryButton'
import './styles.scss'

export type SearchImageProps = {
  setImage: (photo: CreditedImage | undefined) => void
  onClose: () => void
}

// const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

export const SearchImage: React.FC<SearchImageProps> = ({ onClose /* , setImage */ }) => {
  // const { getUnsplashImages } = useUnsplash()
  const [searchQuery, setSearchQuery] = useState('')
  const [tmpSearchQuery, setTmpSearchQuery] = useState('')
  const [unsplashImages, setUnsplashImages] = useState<
    (CreditedImage & { location: string; height: number; width: number })[] | null
  >()
  const [column1, setColumn1] = useState<ReactElement[] | undefined>()
  const [column2, setColumn2] = useState<ReactElement[] | undefined>()
  // const [columnBreakIndex, setColumnBreakIndex] = useState(0)
  // const [leftColumnHeight, setLeftColumnHeight] = useState(0)
  // const [rightColumnHeight, setRightColumnHeight] = useState(0)
  const [showImages, setShowImages] = useState(false)
  const [loadedImages /* , setLoadedImages */] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const searchInput = useRef<HTMLInputElement>(null)

  const searchUnsplashImages = (_query: string, newQuery: boolean) => {
    const page = newQuery ? 1 : totalPages + 1
    setTotalPages(page)
    // const photos = getUnsplashImages(query, page)
    // photos
    //   .then((photos) => {
    //     if (photos) {
    //       updateImages(photos, newQuery)
    //       newQuery && setShowImages(false)
    //       setLoadedImages(0)
    //     } else {
    //       alert('sss')
    //       throw new Error('just to fallback into catch')
    //     }
    //   })
    //   .catch(() => {
    //     window.open(`https://unsplash.com/s/photos/${query}`, '_blank')
    //     onClose()
    //   })
  }

  useEffect(() => {
    searchInput.current?.focus()
    searchInput.current?.select()
  }, [])

  // const getImagesColumn = useCallback(
  //   (photos: (CreditedImage & { location: string })[] | undefined) => {
  //     return photos?.map((photo, i) => {
  //       return (
  //         <div className="image-container" key={i}>
  //           <div
  //             className="image"
  //             onClick={() => {
  //               setImage(photo)
  //               onClose()
  //             }}
  //           >
  //             <img
  //               src={photo.location}
  //               alt=""
  //               onLoad={() => setLoadedImages(prevState => prevState + 1)}
  //             />
  //             <div className="active-overlay" />
  //           </div>
  //           <a className="credits" href={photo.credits?.owner.url} target="_blank" rel="noreferrer">
  //             {photo.credits?.owner.name}
  //           </a>
  //         </div>
  //       )
  //     })
  //   },
  //   [setImage, onClose, setLoadedImages],
  // )

  // const updateImages = (
  //   photos: (CreditedImage & { location: string; height: number; width: number })[],
  //   newQuery: boolean,
  // ) => {
  //   let totalHeight = 0
  //   photos?.map(photo => {
  //     return (totalHeight += photo.height / photo.width / 100 + 21) // 21px of credits
  //   })

  //   const columnHeightDifference = Math.abs(leftColumnHeight - rightColumnHeight)

  //   const leftColumnMaxHeight = newQuery
  //     ? totalHeight / 2
  //     : totalHeight / 2 - columnHeightDifference / 2

  //   let i = 0
  //   let newLeftColumHeight = 0
  //   photos?.every(photo => {
  //     newLeftColumHeight += photo.height / photo.width / 100 + 21
  //     i++
  //     if (newLeftColumHeight < leftColumnMaxHeight) return true
  //     return false
  //   })

  //   setLeftColumnHeight(prev => (newQuery ? newLeftColumHeight : prev + newLeftColumHeight))
  //   setRightColumnHeight(prev =>
  //     newQuery ? totalHeight - newLeftColumHeight : prev + totalHeight - newLeftColumHeight,
  //   )
  //   let column1Images = photos?.slice(0, i)
  //   let column2Images = photos?.slice(i)
  //   if (newQuery) {
  //     setColumnBreakIndex(i)
  //     setUnsplashImages(photos)
  //   } else {
  //     column1Images = unsplashImages
  //       ? unsplashImages.slice(0, columnBreakIndex).concat(column1Images ? column1Images : [])
  //       : []
  //     column2Images = unsplashImages
  //       ? unsplashImages.slice(columnBreakIndex).concat(column2Images ? column2Images : [])
  //       : []
  //     setColumnBreakIndex(prevIndex => prevIndex + i)
  //     setUnsplashImages(column1Images.concat(column2Images))
  //   }
  //   setColumn1(getImagesColumn(column1Images))
  //   setColumn2(getImagesColumn(column2Images))
  // }

  useEffect(() => {
    loadedImages === unsplashImages?.length && unsplashImages?.length !== 0 && setShowImages(true)
    // setLoadedPages((currentState) => currentState++)
  }, [loadedImages, unsplashImages])

  useEffect(() => {
    if (tmpSearchQuery === '') {
      setSearchQuery('')
      setColumn1([])
      setColumn2([])
    }
  }, [tmpSearchQuery, searchQuery])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && tmpSearchQuery !== searchQuery) {
      setSearchQuery(tmpSearchQuery)
      tmpSearchQuery !== '' && searchUnsplashImages(tmpSearchQuery, true)
      setColumn1([])
      setColumn2([])
    }
  }

  const sampleQuerySet = () => {
    const querySet = [
      'mathematics',
      'politics',
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
      'physics',
      'biology',
      'environment',
    ]
    return querySet.map((query, i) => {
      return (
        <PrimaryButton
          key={i}
          color="card"
          onClick={() => {
            setTmpSearchQuery(query)
            setSearchQuery(query)
            setUnsplashImages(undefined)
            setColumn1([])
            setColumn2([])
            searchUnsplashImages(query, true)
            searchInput.current?.focus()
            searchInput.current?.select()
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
        placeholder="Search Unsplash photos"
        edit={true}
        onKeyDown={handleKeyDown}
        value={tmpSearchQuery}
        onChange={v => setTmpSearchQuery(v.currentTarget.value)}
        ref={searchInput}
      />
      <PrimaryButton
        className="search-button"
        color="blue"
        disabled={(tmpSearchQuery === '' && searchQuery === '') || tmpSearchQuery === searchQuery}
        onClick={() => searchUnsplashImages(tmpSearchQuery, true)}
      >
        <Search />
      </PrimaryButton>
    </div>
  )

  return (
    <Modal className="search-image" onClose={onClose} closeButton={false}>
      {searchBox}
      {searchQuery === '' ? (
        <div className="sample-queries-container">{sampleQuerySet()}</div>
      ) : (
        <>
          <div className="images-container" style={{ display: showImages ? 'flex' : 'none' }}>
            <div className="images">
              <div className="column-1">{column1}</div>
              <div className="column-2">{column2}</div>
            </div>
            {unsplashImages && unsplashImages.length > 0 && unsplashImages.length % 30 === 0 && (
              <SecondaryButton
                className="load-more"
                color="grey"
                onClick={() => searchUnsplashImages(tmpSearchQuery, false)}
              >
                Load more
              </SecondaryButton>
            )}
          </div>

          {unsplashImages?.length !== 0 && !showImages && <Loading size={'30px'} />}
          {!unsplashImages ||
            (unsplashImages?.length === 0 && (
              <div className="error-msg">No matching images, try with another word</div>
            ))}
        </>
      )}
    </Modal>
  )
}
SearchImage.defaultProps = {}

export default SearchImage

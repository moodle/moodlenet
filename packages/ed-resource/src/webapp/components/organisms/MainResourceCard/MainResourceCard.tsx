import { Link as LinkIcon, Share } from '@material-ui/icons'
import type { AddonItem, FloatingMenuContentItem } from '@moodlenet/component-library'
import {
  Card,
  FloatingMenu,
  InputTextField,
  Loading,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  TertiaryButton,
  useWindowDimensions,
} from '@moodlenet/component-library'
import type { FormikHandle } from '@moodlenet/react-app/ui'
import {
  capitalizeFirstLetter,
  downloadOrOpenURL,
  getBackupImage,
  getTagList,
  useImageUrl,
} from '@moodlenet/react-app/ui'
import {
  CloudDoneOutlined,
  Delete,
  Edit,
  InsertDriveFile,
  MoreVert,
  Public,
  PublicOff,
  Save,
  Sync,
} from '@mui/icons-material'
import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  ResourceAccessProps,
  ResourceActions,
  ResourceDataProps,
  ResourceFormProps,
  ResourceStateProps,
} from '../../../../common/types.mjs'
import { getResourceTypeInfo } from '../../../../common/types.mjs'
import { UploadResource } from '../UploadResource/UploadResource.js'
import './MainResourceCard.scss'

export type MainResourceCardSlots = {
  mainColumnItems: (AddonItem | null)[]
  headerColumnItems: (AddonItem | null)[]
  topLeftHeaderItems: (AddonItem | null)[]
  topRightHeaderItems: (AddonItem | null)[]
  moreButtonItems: FloatingMenuContentItem[]
  footerRowItems: (AddonItem | null)[]
}

export type MainResourceCardProps = {
  slots: MainResourceCardSlots

  data: ResourceDataProps
  form: FormikHandle<ResourceFormProps>
  contentForm: FormikHandle<{ content: File | string | undefined | null }>
  imageForm: FormikHandle<{ image: File | string | undefined | null }>

  state: ResourceStateProps
  actions: ResourceActions
  access: ResourceAccessProps

  isSaving: boolean
  publish: () => void

  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>

  setShouldShowErrors: React.Dispatch<React.SetStateAction<boolean>>
  shouldShowErrors: boolean

  fileMaxSize: number
}

export const MainResourceCard: FC<MainResourceCardProps> = ({
  slots,

  data,
  form,
  contentForm,
  imageForm,

  state,
  actions,
  access,

  isSaving,
  publish,

  isEditing,
  setIsEditing,

  shouldShowErrors,
  setShouldShowErrors,

  fileMaxSize,
}) => {
  const {
    mainColumnItems,
    headerColumnItems,
    topLeftHeaderItems,
    topRightHeaderItems,
    moreButtonItems,
    footerRowItems,
  } = slots

  const { id, mnUrl, contentType, downloadFilename, imageUrl, contentUrl, tags } = data

  const { isPublished, uploadProgress } = state

  const { unpublish, deleteResource } = actions

  const { canEdit, canPublish, canDelete } = access

  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
  const backupImage: string | undefined = useMemo(() => getBackupImage(id), [id])
  const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  const { width } = useWindowDimensions()

  const [currentContentUrl, setCurrentContentUrl] = useState<string | null>(contentUrl)

  useEffect(() => {
    setCurrentContentUrl(contentUrl)
  }, [contentUrl])

  useEffect(() => {
    setCurrentContentUrl(
      typeof contentForm.values.content === 'string'
        ? contentForm.values.content
        : contentForm.values.content
        ? contentForm.values.content.name
        : null,
    )
  }, [contentForm])

  const { typeName, typeColor } = getResourceTypeInfo(
    contentType,
    contentType === 'file' ? downloadFilename : currentContentUrl,
  )

  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined | null>(imageUrl)
  const [image] = useImageUrl(currentImageUrl, backupImage)
  const [imageFromForm] = useImageUrl(imageForm.values.image)

  const handleOnEditClick = () => {
    setIsEditing(true)
  }

  const handleOnSaveClick = () => {
    if (form.isValid) {
      form.submitForm()
      setShouldShowErrors(false)
      setIsEditing(false)
    } else {
      setShouldShowErrors(true)
    }
  }

  useEffect(() => {
    setCurrentImageUrl(imageUrl)
  }, [imageUrl])

  useEffect(() => {
    setCurrentImageUrl(imageFromForm)
  }, [imageFromForm])

  const copyUrl = () => {
    navigator.clipboard.writeText(mnUrl)
    setShowUrlCopiedAlert(false)
    setTimeout(() => {
      setShowUrlCopiedAlert(true)
    }, 100)
  }

  // const setImage = (image: AssetInfo | undefined) => {
  //   form.setFieldValue('image', image)
  // }

  const title = canEdit ? (
    <InputTextField
      name="title"
      isTextarea
      key="title"
      textAreaAutoSize
      noBorder
      edit={isEditing}
      className="title underline"
      value={form.values.title}
      placeholder="Title"
      onChange={form.handleChange}
      style={{
        pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
      }}
      error={shouldShowErrors && form.errors.title && capitalizeFirstLetter(form.errors.title)}
    />
  ) : (
    <div className="title" key="resource-title">
      {form.values.title}
    </div>
  )

  const resourceLabel = (
    <div className="resource-label" key="resource-label">
      Resource
    </div>
  )

  const typePill =
    typeName && typeColor ? (
      <div
        className="type-pill"
        key="type-pill"
        style={{
          background: typeColor,
        }}
      >
        {typeName}
      </div>
    ) : null

  const [showSavedText, setShowSavedText] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    isSaving && setSaved(true)
    if (!isSaving && saved) {
      setShowSavedText(true)
      setTimeout(() => setShowSavedText(false), 3000)
    }
  }, [isSaving, setShowSavedText, saved])

  const savingFeedback = isSaving ? (
    <abbr className="saving-feedback" key="saving-feedback" title="Saving">
      <Sync />
      Saving...
    </abbr>
  ) : saved ? (
    <abbr className="saved-feedback" key="saved-feedback" title="Saved">
      <CloudDoneOutlined />
      {showSavedText && 'Saved'}
    </abbr>
  ) : null

  const updatedTopLeftHeaderItems = [
    resourceLabel,
    typePill,
    savingFeedback,
    ...(topLeftHeaderItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  // const likeButton =
  //   isPublished || numLikes > 0 ? (
  //     <TertiaryButton
  //       className={`like ${!canLike ? '' : 'disabled'} ${liked && 'liked'}`}
  //       onClick={canLike ? toggleLike : () => undefined}
  //       abbr={isCreator ? 'Creators cannot like their own content' : liked ? 'Unlike' : 'Like'}
  //       key="like-button"
  //     >
  //       {liked ? <Favorite /> : <FavoriteBorder />}
  //       <span>{numLikes}</span>
  //     </TertiaryButton>
  //   ) : null

  const empty =
    (!form.values.title || form.values.title === '') &&
    (!form.values.description || form.values.description === '') &&
    !contentForm.values.content &&
    !imageForm.values.image

  // const bookmarkButtonSmallScreen: FloatingMenuContentItem | null =
  //   !empty && width < 800
  //     ? {
  //         key: 'bookmark-button',
  //         className: `bookmark ${bookmarked && 'bookmarked'}`,
  //         onClick: toggleBookmark ? () => toggleBookmark : () => undefined,
  //         text: bookmarked ? 'Remove bookmark' : 'Bookmark',
  //         Icon: bookmarked ? <Bookmark /> : <BookmarkBorder />,
  //       }
  //     : null

  // const bookmarkButtonBigScreen = !empty && width > 800 && (
  //   <TertiaryButton
  //     key="bookmark-button"
  //     className={`bookmark ${bookmarked && 'bookmarked'}`}
  //     abbr={bookmarked ? 'Remove bookmark' : 'Bookmark'}
  //     onClick={toggleBookmark ? () => toggleBookmark : () => undefined}
  //   >
  //     {bookmarked ? <Bookmark /> : <BookmarkBorder />}
  //   </TertiaryButton>
  // )

  const shareButton: FloatingMenuContentItem | null =
    !empty && isPublished
      ? {
          Element: (
            <div key="share-button" onClick={copyUrl}>
              <Share /> Share
            </div>
          ),
        }
      : null

  const deleteButton: FloatingMenuContentItem | null =
    canDelete && !empty
      ? {
          Element: (
            <div key="delete-button" onClick={() => setIsToDelete(true)}>
              <Delete /> Delete
            </div>
          ),
        }
      : null

  const publishButton: FloatingMenuContentItem | null =
    canPublish && !isPublished
      ? {
          Element: (
            <div key="publish-button" onClick={publish}>
              <Public style={{ fill: '#00bd7e' }} />
              Publish
            </div>
          ),

          wrapperClassName: 'publish-button',
        }
      : null

  const unpublishButton: FloatingMenuContentItem | null =
    canPublish && isPublished
      ? {
          Element: (
            <div key="unpublish-button" onClick={unpublish}>
              <PublicOff />
              Unpublish
            </div>
          ),
          wrapperClassName: 'unpublish-button',
        }
      : null

  // const publishingButton =
  //   canPublish && !isPublished ? (
  //     <abbr key="publishing-button" title="Publish requested" style={{ cursor: 'initial' }}>
  //       <HourglassBottom style={{ fill: '#d0d1db' }} />
  //     </abbr>
  //   ) : null

  const publishedButton =
    canPublish && isPublished ? (
      <abbr title="Published" key="publishing-button" style={{ cursor: 'initial' }}>
        <Public style={{ fill: '#00bd7e' }} />
      </abbr>
    ) : null

  const unpublishedButton =
    canPublish && !isPublished ? (
      <abbr title="Unpublished" key="unpublished-button" style={{ cursor: 'initial' }}>
        <PublicOff style={{ fill: '#a7a7a7' }} />
      </abbr>
    ) : null

  // const sendToMoodleButton: (AddonItem | null) | null =
  //   width < 800 && form.values.content
  //     ? {
  //         Item: () => (
  //           <div key="send-to-moodle-button" tabIndex={0} onClick={() => setIsPublished(false)}>
  //             <MoodleIcon />
  //             Send to Moodle
  //           </div>
  //         ),
  //         key: 'send-to-moodle-button',
  //       }
  //     : null

  // const addToCollectionButton: (AddonItem | null) | null =
  //   width < 800 && form.values.content && isAuthenticated
  //     ? {
  //         Item: () => (
  //           <div key="add-to-collection-button" tabIndex={0} onClick={() => setIsPublished(false)}>
  //             <AddToPhotos />
  //             Add to collection
  //           </div>
  //         ),
  //         key: 'add-to-collection-button',
  //       }
  //     : null

  const openLinkOrDownloadFile: FloatingMenuContentItem | null =
    width < 800 && contentUrl
      ? {
          Element:
            contentType === 'file' ? (
              <div
                key="open-link-or-download-file-button"
                onClick={() => downloadOrOpenURL(contentUrl, downloadFilename)}
              >
                <InsertDriveFile />
                Download
              </div>
            ) : (
              <div
                key="open-link-or-download-file-button"
                onClick={() => downloadOrOpenURL(contentUrl, downloadFilename)}
              >
                <LinkIcon />
                Open link
              </div>
            ),
        }
      : null

  const updatedMoreButtonItems = [
    publishButton,
    unpublishButton,
    openLinkOrDownloadFile,
    shareButton,
    deleteButton,
    // bookmarkButtonSmallScreen,
    // sendToMoodleButton,
    // addToCollectionButton,
    ...(moreButtonItems ?? []),
  ].filter((item): item is FloatingMenuContentItem => !!item)

  const moreButton =
    !empty && updatedMoreButtonItems.length > 0 ? (
      // updatedMoreButtonItems.length === 1 ? (
      //   updatedMoreButtonItems.map(i => {
      //     return (
      //       <TertiaryButton
      //         key={i.key}
      //         abbr={i.text}
      //         onClick={i.onClick}
      //         className={i.className ?? i.key}
      //       >
      //         {i.Icon}
      //       </TertiaryButton>
      //     )
      //   })
      // ) : (
      <FloatingMenu
        className="more-button"
        key="more-button"
        menuContent={updatedMoreButtonItems}
        hoverElement={
          <TertiaryButton className={`more`} abbr="More options">
            <MoreVert />
          </TertiaryButton>
        }
      />
    ) : // )
    null

  const editSaveButton = canEdit
    ? {
        Item: () => (
          <div className="edit-save">
            {isEditing ? (
              <PrimaryButton
                className={`${form.isSubmitting ? 'loading' : ''}`}
                color="green"
                onClick={handleOnSaveClick}
              >
                <div
                  className="loading"
                  style={{
                    visibility: form.isSubmitting ? 'visible' : 'hidden',
                  }}
                >
                  <Loading color="white" />
                </div>
                <div
                  className="label"
                  style={{
                    visibility: form.isSubmitting ? 'hidden' : 'visible',
                  }}
                >
                  <Save />
                </div>
              </PrimaryButton>
            ) : (
              <SecondaryButton onClick={handleOnEditClick} color="orange">
                <Edit />
              </SecondaryButton>
            )}
          </div>
        ),
        key: 'edit-save-button',
      }
    : null

  const updatedTopRightHeaderItems = [
    // likeButton,
    publishedButton,
    // publishingButton,
    unpublishedButton,
    // bookmarkButtonBigScreen,
    // editSaveButton,
    ...(topRightHeaderItems ?? []),
    moreButton,
    editSaveButton,
  ].filter((item): item is AddonItem => !!item)

  const topHeaderRow = (
    <div className="top-header-row" key="top-header-row">
      <div className="top-left-header" key="top-left-header">
        {updatedTopLeftHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
      <div className="top-right-header" key="top-right-header">
        {updatedTopRightHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    </div>
  )

  const tagsContainer = tags ? (
    <div className="tags scroll" key="tags">
      {getTagList(tags, 'medium')}
    </div>
  ) : null

  const updatedHeaderColumnItems = [
    topHeaderRow,
    title,
    tagsContainer,
    ...(headerColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const resourceHeader = (
    <div className="resource-header" key="resource-header">
      {updatedHeaderColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </div>
  )

  // const embed = contentUrl
  //   ? getPreviewFromUrl(contentUrl)
  //   : typeof contentForm.values.content === 'string'
  //   ? getPreviewFromUrl(contentForm.values.content)
  //   : null

  const resourceUploader = (
    <UploadResource
      displayOnly={(canEdit && !isEditing) || !canEdit}
      contentForm={contentForm}
      imageForm={imageForm}
      fileMaxSize={fileMaxSize}
      downloadFilename={downloadFilename}
      uploadProgress={uploadProgress}
      shouldShowErrors={shouldShowErrors}
      contentType={contentType}
      imageOnClick={() => setIsShowingImage(true)}
      key="resource-uploader"
    />
  )

  // const imageDiv = (
  //   <img
  //     className="image"
  //     key="image"
  //     src={image}
  //     alt="Background"
  //     {...(contentType === 'file' &&
  //       typeName === 'Image' && {
  //         onClick: () => setIsShowingImage(true),
  //       })}
  //     style={{
  //       maxHeight: image ? 'fit-content' : '150px',
  //       cursor: contentType === 'file' && typeName !== 'Image' ? 'initial' : 'pointer',
  //     }}
  //   />
  // )

  // const imageContainer =
  //   !canEdit || !isEditing
  //     ? embed ??
  //       ((contentForm.values.content || contentUrl) && (imageForm.values.image || imageUrl) ? (
  //         <div className="image-container" key="image-container">
  //           {contentType === 'link' && contentUrl ? (
  //             <a href={contentUrl} target="_blank" rel="noreferrer">
  //               {imageDiv}
  //             </a>
  //           ) : (
  //             <>{imageDiv}</>
  //           )}
  //           {/* {getImageCredits(form.values.image)} */}
  //         </div>
  //       ) : null)
  //     : null

  // const searchImageComponent = isSearchingImage && (
  //   <SearchImage onClose={() => setIsSearchingImage(false)} setImage={setImage} />
  // )

  const descriptionRef = useRef<HTMLDivElement>(null)
  const [showFullDescription, setShowFullDescription] = useState(true)
  // const [isSmallDescription, setIsSmallDescription] = useState(false)

  useEffect(() => {
    const fieldElem = descriptionRef.current
    if (fieldElem) {
      {
        fieldElem.scrollHeight > 70 && setShowFullDescription(false)
        // fieldElem.scrollHeight > 70 ? setShowFullDescription(false) : setIsSmallDescription(true)
        // fieldElem.style.height = Math.ceil(fieldElem.scrollHeight / 10) * 10 + 'px'}
      }
    }
  }, [descriptionRef])

  const description = canEdit ? (
    <InputTextField
      className="description underline"
      name="description"
      key="description"
      isTextarea
      textAreaAutoSize
      noBorder
      edit={isEditing}
      placeholder="Description"
      value={form.values.description}
      onChange={form.handleChange}
      style={{
        pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
      }}
      error={shouldShowErrors && form.errors.description}
    />
  ) : (
    <div className="description" key="description-container">
      <div
        className="description-text"
        ref={descriptionRef}
        style={{
          height: showFullDescription ? 'fit-content' : '66px',
          overflow: showFullDescription ? 'auto' : 'hidden',
          // paddingBottom: showFullDescription && !isSmallDescription ? '20px' : 0,
        }}
      >
        {form.values.description}
      </div>
      {!showFullDescription && (
        <div className="see-more" onClick={() => setShowFullDescription(true)}>
          ...see more
        </div>
      )}
      {/* {showFullDescription && !isSmallDescription && (
              <div className="see-more" onClick={() => setShowFullDescription(false)}>
                see less
              </div>
            )} */}
    </div>
  )

  const updatedFooterRowItems = [...(footerRowItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const resourceFooter =
    updatedFooterRowItems.length > 0 ? (
      <div className="resource-footer" key="resource-footer">
        {updatedFooterRowItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    ) : null

  const updatedMainColumnItems = [
    resourceHeader,
    resourceUploader,
    // imageContainer,
    description,
    resourceFooter,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const snackbars = (
    <>
      {showUrlCopiedAlert && (
        <Snackbar
          type="success"
          position="bottom"
          autoHideDuration={6000}
          showCloseButton={false}
          key="url-copy-snackbar"
        >
          Copied to clipoard
        </Snackbar>
      )}
    </>
  )

  const modals = (
    <>
      {isShowingImage && imageUrl && (
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
          {/* {getImageCredits(form.values.image)} */}
        </Modal>
      )}
      {isToDelete && deleteResource && (
        <Modal
          title={`Alert`}
          actions={
            <PrimaryButton
              onClick={() => {
                deleteResource()
                setIsToDelete(false)
              }}
              color="red"
            >
              Delete
            </PrimaryButton>
          }
          onClose={() => setIsToDelete(false)}
          style={{ maxWidth: '400px' }}
          className="delete-message"
          key="delete-message-modal"
        >
          The resource will be deleted
        </Modal>
      )}
    </>
  )
  return (
    <>
      {modals}
      {snackbars}
      {/* {searchImageComponent} */}
      <Card className="main-resource-card" key="main-resource-card" hideBorderWhenSmall={true}>
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    </>

    //   <MainLayout {...mainLayoutProps}>
    //     {modals}
    //     {snackbars}
    //     {searchImageComponent}
    //     <div className="resource">
    //       <div className="content">
    //         <div className="main-column">
    //
    //         </div>
    //         <div className="side-column">
    //           {updatedSideColumnItems?.map(i => (
    //             <i.Item key={i.key} />
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //   </MainLayout>
  )
}
MainResourceCard.displayName = 'MainResourceCard'
export default MainResourceCard

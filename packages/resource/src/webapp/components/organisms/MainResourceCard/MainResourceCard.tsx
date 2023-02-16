import {
  Bookmark,
  BookmarkBorder,
  Favorite,
  FavoriteBorder,
  Link as LinkIcon,
  Share,
} from '@material-ui/icons'
import {
  AddonItem,
  Card,
  FloatingMenu,
  FloatingMenuContentItem,
  InputTextField,
  Modal,
  PrimaryButton,
  Snackbar,
  TertiaryButton,
  useWindowDimensions,
} from '@moodlenet/component-library'
import { AssetInfo } from '@moodlenet/react-app/common'
import { FormikHandle, getBackupImage, useImageUrl } from '@moodlenet/react-app/ui'
import {
  CloudDoneOutlined,
  HourglassBottom,
  InsertDriveFile,
  MoreVert,
  Public,
  PublicOff,
  Sync,
} from '@mui/icons-material'
import {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getResourceTypeInfo, ResourceFormValues, ResourceType } from '../../../../common/types.mjs'
import { UploadResource } from '../UploadResource/UploadResource.js'
import './MainResourceCard.scss'

export type MainResourceCardProps = {
  mainColumnItems?: AddonItem[]
  headerColumnItems?: AddonItem[]
  topLeftHeaderItems?: AddonItem[]
  topRightHeaderItems?: AddonItem[]
  moreButtonItems?: FloatingMenuContentItem[]
  footerRowItems?: AddonItem[]

  resource: ResourceFormValues
  form: FormikHandle<ResourceFormValues>
  downloadFilename: string
  type: string
  editResource: (values: ResourceFormValues) => Promise<unknown>
  publish: () => void
  deleteResource?(): unknown
  setIsPublished: Dispatch<SetStateAction<boolean>>
  isPublished: boolean
  isWaitingForApproval?: boolean
  isSaving?: boolean
  isSaved?: boolean

  // isEditing: boolean
  // setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  shouldShowErrors: boolean
  // setShouldShowErrors: React.Dispatch<React.SetStateAction<boolean>>
  isAuthenticated: boolean
  isOwner: boolean
  isAdmin?: boolean
  canEdit: boolean
  autoImageAdded: boolean
  canSearchImage: boolean
  fileMaxSize: number
  uploadProgress?: number

  liked: boolean
  toggleLike?(): unknown
  bookmarked: boolean
  toggleBookmark?(): unknown
  // isApproved: boolean
  // reportForm?: FormikHandle<{ comment: string }>
  // tags: FollowTag[]
} & ResourceType

export const MainResourceCard: FC<MainResourceCardProps> = ({
  mainColumnItems,
  headerColumnItems,
  topLeftHeaderItems,
  topRightHeaderItems,
  moreButtonItems,
  footerRowItems,
  // isEditing,
  // setIsEditing,

  form,
  // resource,
  // editResource,
  // saveResource,
  isPublished,
  publish,
  deleteResource,
  setIsPublished,
  isWaitingForApproval,
  isSaving,
  isSaved,
  // resourceValidator

  id: resourceId,
  url: resourceUrl,
  contentType,
  type,
  // resourceFormat,
  contentUrl,
  numLikes,
  //   tags,
  fileMaxSize,
  uploadProgress,

  shouldShowErrors,
  // setShouldShowErrors,
  isAuthenticated,
  canEdit,
  // isAdmin,
  isOwner,
  // autoImageAdded,
  // canSearchImage,

  liked,
  toggleLike,
  bookmarked,
  toggleBookmark,
}) => {
  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
  const backupImage: AssetInfo | null | undefined = useMemo(
    () => getBackupImage(resourceId),
    [resourceId],
  )
  const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  const [imageUrl] = useImageUrl(form.values?.image?.location, backupImage?.location)
  const { typeName, typeColor } = getResourceTypeInfo(type)
  const { width } = useWindowDimensions()

  const copyUrl = () => {
    navigator.clipboard.writeText(resourceUrl)
    setShowUrlCopiedAlert(false)
    setTimeout(() => {
      setShowUrlCopiedAlert(true)
    }, 100)
  }

  // const setImage = (image: AssetInfo | undefined) => {
  //   form.setFieldValue('image', image)
  // }

  const getImageCredits = (image: AssetInfo | undefined | null) => {
    const credits = image ? (image.credits ? image.credits : undefined) : backupImage?.credits
    return (
      credits && (
        <div className="image-credits">
          Photo by
          <a href={credits.owner.url} target="_blank" rel="noreferrer">
            {credits.owner.name}
          </a>
          on
          {
            <a href={credits.owner.url} target="_blank" rel="noreferrer">
              {credits.provider?.name}
            </a>
          }
        </div>
      )
    )
  }

  const title = canEdit ? (
    <InputTextField
      name="name"
      isTextarea
      key="resource-title"
      textAreaAutoSize
      displayMode
      className="title underline"
      value={form.values.name}
      placeholder="Title"
      onChange={form.handleChange}
      style={{
        pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
      }}
      error={shouldShowErrors && form.errors.name}
    />
  ) : (
    <div className="title" key="resource-title">
      {form.values.name}
    </div>
  )

  //   const tagsDiv: AddonItem = {
  //     Item: () =>
  //       tags.length > 0 ? <div className="tags scroll">{getTagList(tags, 'medium')}</div> : <></>,
  //     key: 'type-and-actions',
  //   }

  const resourceLabel = (
    <div className="resource-label" key="resource-label">
      Resource
    </div>
  )

  const typePill = type && (
    <div
      className="type-pill"
      key="type-pill"
      style={{
        background: typeColor,
      }}
    >
      {typeName}
    </div>
  )

  const savingFeedback = isSaving ? (
    <abbr className="saving-feedback" key="saving-feedback" title="Saving">
      <Sync />
      {/* Saving */}
    </abbr>
  ) : null

  const savedFeedback =
    !isSaving && isSaved ? (
      // const [showSavedText, setShowSavedText] = useState(true)
      // setTimeout(() => setShowSavedText(false), 3000)

      <abbr className="saved-feedback" key="saved-feedback" title="Saved">
        <CloudDoneOutlined />
        {/* {showSavedText && 'Saved'} */}
      </abbr>
    ) : null

  const updatedTopLeftHeaderItems = [
    resourceLabel,
    typePill,
    savingFeedback,
    savedFeedback,
    ...(topLeftHeaderItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const likeButton = isPublished ? (
    <TertiaryButton
      className={`like ${isAuthenticated && !isOwner ? '' : 'disabled'} ${liked && 'liked'}`}
      onClick={isAuthenticated && !isOwner && toggleLike ? toggleLike : () => undefined}
      abbr={liked ? 'Unlike' : 'Like'}
      key="like-button"
    >
      {liked ? <Favorite /> : <FavoriteBorder />}
      <span>{numLikes}</span>
    </TertiaryButton>
  ) : null

  const bookmarkButton = isAuthenticated ? (
    <TertiaryButton
      className={`bookmark ${bookmarked && 'bookmarked'}`}
      onClick={toggleBookmark}
      key="bookmark-button"
      abbr={bookmarked ? 'Remove bookmark' : 'Bookmark'}
    >
      {bookmarked ? <Bookmark /> : <BookmarkBorder />}
    </TertiaryButton>
  ) : null

  const shareButton: FloatingMenuContentItem | null = {
    key: 'share-button',
    onClick: copyUrl,
    text: 'Share',
    Icon: <Share />,
  }

  // const deleteButton: FloatingMenuContentItem | null = {
  //   key: 'delete-button',
  //   onClick: () => setIsToDelete(true),
  //   text: 'Delete',
  //   Icon: <Delete />,
  // }

  const publishButton: FloatingMenuContentItem | null =
    width < 800 && canEdit && !isPublished && !isWaitingForApproval
      ? {
          Icon: <Public />,
          text: 'Publish',
          key: 'publish-button',
          onClick: publish,
        }
      : null

  const draftButton: FloatingMenuContentItem | null =
    width < 800 && canEdit && (isPublished || isWaitingForApproval)
      ? {
          Icon: <PublicOff />,
          text: 'Back to draft',
          key: 'draft-button',
          onClick: () => setIsPublished(false),
        }
      : null

  const publishingButton =
    width < 800 && canEdit && !isPublished && isWaitingForApproval ? (
      <abbr key="publishing-button" title="Publish requested" style={{ cursor: 'initial' }}>
        <HourglassBottom style={{ fill: '#d0d1db' }} />
      </abbr>
    ) : null

  const publishedButton =
    width < 800 && canEdit && isPublished ? (
      <abbr title="Resource published" key="publishing-button" style={{ cursor: 'initial' }}>
        <Public style={{ fill: '#00bd7e' }} />
      </abbr>
    ) : null

  // const sendToMoodleButton: AddonItem | null =
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

  // const addToCollectionButton: AddonItem | null =
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
    width < 800 && form.values.content
      ? {
          Icon: form.values.content instanceof File ? <InsertDriveFile /> : <LinkIcon />,
          text: form.values.content instanceof File ? 'Download file' : 'Open link',
          key: 'open-link-or-download-file-button',
          onClick: () => setIsPublished(false),
        }
      : null

  const updatedMoreButtonItems = [
    publishButton,
    draftButton,
    openLinkOrDownloadFile,
    shareButton,
    // deleteButton,
    // sendToMoodleButton,
    // addToCollectionButton,
    ...(moreButtonItems ?? []),
  ].filter((item): item is FloatingMenuContentItem => !!item)

  const moreButton =
    updatedMoreButtonItems.length > 0 ? (
      updatedMoreButtonItems.length === 1 ? (
        updatedMoreButtonItems.map(i => {
          return (
            <TertiaryButton key={i.key} abbr={i.text} onClick={i.onClick}>
              {i.Icon}
            </TertiaryButton>
          )
        })
      ) : (
        <FloatingMenu
          className="more-button"
          key="more-button"
          menuContent={updatedMoreButtonItems.map(i => (
            <div key={i.key} onClick={i.onClick} tabIndex={0}>
              {i.Icon}
              {i.text}
            </div>
          ))}
          hoverElement={
            <TertiaryButton className={`more`} abbr="More options">
              <MoreVert />
            </TertiaryButton>
          }
        />
      )
    ) : null

  // const editSaveButton = canEdit
  //   ? {
  //       Item: () => (
  //         <div className="edit-save">
  //           {isEditing ? (
  //             <PrimaryButton
  //               className={`${form.isSubmitting ? 'loading' : ''}`}
  //               color="green"
  //               onClick={handleOnSaveClick}
  //             >
  //               <div
  //                 className="loading"
  //                 style={{
  //                   visibility: form.isSubmitting ? 'visible' : 'hidden',
  //                 }}
  //               >
  //                 <Loading color="white" />
  //               </div>
  //               <div
  //                 className="label"
  //                 style={{
  //                   visibility: form.isSubmitting ? 'hidden' : 'visible',
  //                 }}
  //               >
  //                 <Save />
  //               </div>
  //             </PrimaryButton>
  //           ) : (
  //             <SecondaryButton onClick={handleOnEditClick} color="orange">
  //               <Edit />
  //             </SecondaryButton>
  //           )}
  //         </div>
  //       ),
  //       key: 'edit-save-button',
  //     }
  //   : null

  // const deleteButton: AddonItem | null =
  //   width < 800
  //     ? {
  //         Item: () => (
  //           <SecondaryButton
  //             color="red"
  //             onHoverColor="fill-red"
  //             className="delete-button"
  //             onClick={() => setIsToDelete(true)}
  //           >
  //             <DeleteOutline />
  //           </SecondaryButton>
  //         ),
  //         key: 'delete-button',
  //       }
  //     : null

  const updatedTopRightHeaderItems = [
    likeButton,
    bookmarkButton,
    publishedButton,
    publishingButton,
    // deleteButton,
    // editSaveButton,
    ...(topRightHeaderItems ?? []),
    moreButton,
  ].filter((item): item is AddonItem => !!item)

  const topHeaderRow = (
    <div className="top-header-row" key="top-header-row">
      <div className="top-left-header">
        {updatedTopLeftHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
      <div className="top-right-header">
        {updatedTopRightHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    </div>
  )

  const updatedHeaderColumnItems = [
    topHeaderRow,
    title,
    // tagsDiv,
    ...(headerColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const resourceHeader = (
    <div className="resource-header" key="resource-header">
      {updatedHeaderColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </div>
  )

  const resourceUploader = canEdit ? (
    <UploadResource
      form={form}
      fileMaxSize={fileMaxSize}
      uploadProgress={uploadProgress}
      key="resource-uploader"
      imageOnClick={() => setIsShowingImage(true)}
    />
  ) : null

  const imageDiv = (
    <img
      className="image"
      src={imageUrl}
      alt="Background"
      {...(contentType === 'file' && {
        onClick: () => setIsShowingImage(true),
      })}
      style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
    />
  )

  const imageContainer = !canEdit ? (
    form.values.content && form.values.image ? (
      <div className="image-container" key="image-container">
        {contentType === 'link' ? (
          <a href={contentUrl} target="_blank" rel="noreferrer">
            {imageDiv}
          </a>
        ) : (
          <>{imageDiv}</>
        )}
        {/* {getImageCredits(form.values.image)} */}
      </div>
    ) : null
  ) : null

  // const searchImageComponent = isSearchingImage && (
  //   <SearchImage onClose={() => setIsSearchingImage(false)} setImage={setImage} />
  // )

  // const description: AddonItem = {
  //   Item: () => (
  //     // form.values.content ? (
  //     <>
  //       {canEdit ? (
  //         <InputTextField
  //           className="description underline"
  //           name="description"
  //           isTextarea
  //           textAreaAutoSize
  //           displayMode
  //           placeholder="Description"
  //           value={form.values.description}
  //           onChange={form.handleChange}
  //           style={{
  //             pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
  //           }}
  //           error={shouldShowErrors && form.errors.description}
  //         />
  //       ) : (
  //         <div className="description"> {form.values.description} </div>
  //       )}
  //     </>
  //   ),
  //   // ) : (
  //   //   <></>
  //   // ),
  //   key: 'description',
  // }

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
      isTextarea
      textAreaAutoSize
      displayMode
      placeholder="Description"
      value={form.values.description}
      onChange={form.handleChange}
      style={{
        pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
      }}
      error={shouldShowErrors && form.errors.description}
    />
  ) : (
    <div className="description">
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

  const resourceFooter = (
    <div className="resource-footer" key="resource-footer">
      {updatedFooterRowItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </div>
  )

  const updatedMainColumnItems = [
    resourceHeader,
    resourceUploader,
    imageContainer,
    description,
    resourceFooter,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem | ReactElement => !!item)

  const snackbars = (
    <>
      {showUrlCopiedAlert && (
        <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
          Copied to clipoard
        </Snackbar>
      )}
    </>
  )

  const modals = (
    <>
      {isShowingImage /* && imageUrl */ && (
        <Modal
          className="image-modal"
          closeButton={false}
          onClose={() => setIsShowingImage(false)}
          style={{
            maxWidth: '90%',
            maxHeight: form.values.type !== '' ? 'calc(90% + 20px)' : '90%',
          }}
        >
          <img src={imageUrl} alt="Resource" />
          {getImageCredits(form.values.image)}
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
      <Card className="main-resource-card" hideBorderWhenSmall={true}>
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

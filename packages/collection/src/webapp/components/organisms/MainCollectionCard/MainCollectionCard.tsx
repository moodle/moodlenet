import { Bookmark, BookmarkBorder, Share } from '@material-ui/icons'
import {
  AddonItem,
  Card,
  FloatingMenu,
  FloatingMenuContentItem,
  InputTextField,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  TertiaryButton,
  useWindowDimensions,
} from '@moodlenet/component-library'
import { AssetInfo } from '@moodlenet/react-app/common'
import { FormikHandle, getBackupImage, useImageUrl } from '@moodlenet/react-app/ui'
import {
  CloudDoneOutlined,
  Delete,
  HourglassBottom,
  MoreVert,
  PermIdentity,
  Person,
  Public,
  PublicOff,
  Sync,
} from '@mui/icons-material'
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { CollectionFormValues, CollectionType } from '../../../../common/types.mjs'
import { UploadImage } from '../UploadImage/UploadImage.js'
import './MainCollectionCard.scss'

export type MainCollectionCardProps = {
  mainColumnItems?: AddonItem[]
  headerColumnItems?: AddonItem[]
  topLeftHeaderItems?: AddonItem[]
  topRightHeaderItems?: AddonItem[]
  moreButtonItems?: FloatingMenuContentItem[]
  footerRowItems?: AddonItem[]

  collection: CollectionFormValues
  form: FormikHandle<CollectionFormValues>
  editCollection: (values: CollectionFormValues) => Promise<unknown>
  deleteCollection?(): unknown
  hasBeenPublished: boolean //At any point on time, so it might already have followers
  publish: () => void
  isPublished: boolean
  setIsPublished: Dispatch<SetStateAction<boolean>>
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

  followed: boolean
  toggleFollow?(): unknown
  bookmarked: boolean
  toggleBookmark?(): unknown
  // isApproved: boolean
  // reportForm?: FormikHandle<{ comment: string }>
  // tags: FollowTag[]
} & CollectionType

export const MainCollectionCard: FC<MainCollectionCardProps> = ({
  mainColumnItems,
  headerColumnItems,
  topLeftHeaderItems,
  topRightHeaderItems,
  moreButtonItems,
  footerRowItems,
  // isEditing,
  // setIsEditing,

  form,
  // collection,
  // editCollection,
  // saveCollection,
  publish,
  isPublished,
  setIsPublished,
  isWaitingForApproval,
  hasBeenPublished,
  deleteCollection,
  isSaving,
  isSaved,
  // collectionValidator

  id: collectionId,
  url: collectionUrl,
  // collectionFormat,
  numFollowers,
  //   tags,

  shouldShowErrors,
  // setShouldShowErrors,
  isAuthenticated,
  canEdit,
  // isAdmin,
  isOwner,
  // autoImageAdded,
  // canSearchImage,

  followed,
  toggleFollow,
  bookmarked,
  toggleBookmark,
}) => {
  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
  const backupImage: AssetInfo | null | undefined = useMemo(
    () => getBackupImage(collectionId),
    [collectionId],
  )
  const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  const [imageUrl] = useImageUrl(form.values?.image?.location, backupImage?.location)
  const { width } = useWindowDimensions()

  const copyUrl = () => {
    navigator.clipboard.writeText(collectionUrl)
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
      textAreaAutoSize
      displayMode
      className="title underline"
      value={form.values.name}
      placeholder="Title"
      key="title"
      onChange={form.handleChange}
      style={{
        pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
      }}
      error={shouldShowErrors && form.errors.name}
    />
  ) : (
    <div className="title" key="title">
      {form.values.name}
    </div>
  )

  //   const tagsDiv: AddonItem = {
  //     Item: () =>
  //       tags.length > 0 ? <div className="tags scroll">{getTagList(tags, 'medium')}</div> : <></>,
  //     key: 'type-and-actions',
  //   }

  const collectionLabel = (
    <div className="collection-label" key="collection-label">
      Collection
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
    collectionLabel,
    savingFeedback,
    savedFeedback,
    ...(topLeftHeaderItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const followersButton =
    isPublished || hasBeenPublished ? (
      <TertiaryButton
        className={`follow ${followed ? 'followed' : ''}`}
        disabled={!isAuthenticated || isOwner}
        onClick={isAuthenticated && !isOwner && toggleFollow ? toggleFollow : () => undefined}
        abbr={
          isOwner ? 'Creators cannot follow their own content' : followed ? 'Unfollow' : 'Follow'
        }
        key="followers-button"
      >
        {followed ? <Person /> : <PermIdentity />}
        <span>{numFollowers}</span>
      </TertiaryButton>
    ) : null

  const empty =
    !form.values.content && !form.values.name && !form.values.description && !form.values.image

  const bookmarkButtonSmallScreen =
    !empty && width < 800
      ? {
          key: 'bookmark-button',
          className: `bookmark ${bookmarked && 'bookmarked'}`,
          onClick: toggleBookmark ? () => toggleBookmark : () => undefined,
          text: bookmarked ? 'Remove bookmark' : 'Bookmark',
          Icon: bookmarked ? <Bookmark /> : <BookmarkBorder />,
        }
      : null

  const bookmarkButtonBigScreen = !empty && width > 800 && (
    <TertiaryButton
      key="bookmark-button"
      className={`bookmark ${bookmarked && 'bookmarked'}`}
      abbr={bookmarked ? 'Remove bookmark' : 'Bookmark'}
      onClick={toggleBookmark ? () => toggleBookmark : () => undefined}
    >
      {bookmarked ? <Bookmark /> : <BookmarkBorder />}
    </TertiaryButton>
  )

  const shareButton: FloatingMenuContentItem | null = isPublished
    ? {
        key: 'share-button',
        onClick: copyUrl,
        text: 'Share',
        Icon: <Share />,
      }
    : null

  const deleteButton: FloatingMenuContentItem | null = !empty
    ? {
        key: 'delete-button',
        onClick: () => setIsToDelete(true),
        text: 'Delete',
        Icon: <Delete />,
      }
    : null

  const publishButton =
    width < 800 && canEdit && !isPublished && !isWaitingForApproval ? (
      <TertiaryButton
        abbr="Publish"
        onClick={publish}
        className="publish-button"
        key="publish-button"
      >
        <Public />
      </TertiaryButton>
    ) : null

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

  // const addToCollectionButton: AddonItem | null =
  //   width < 800 && form.values.content && isAuthenticated
  //     ? {
  //         Item: () => (
  //           <div key="add-to-collection-button" tabIndex={0} onClick={() => setisPublished(false)}>
  //             <AddToPhotos />
  //             Add to collection
  //           </div>
  //         ),
  //         key: 'add-to-collection-button',
  //       }
  //     : null

  // const openLinkOrDownloadFile: AddonItem | null =
  //   width < 800 && form.values.content
  //     ? {
  //         Item: () => (
  //           <abbr
  //             key="open-link-or-download-file-button"
  //             tabIndex={0}
  //             onClick={() => setIsPublished(false)}
  //             title={form.values.content instanceof File ? 'Download file' : 'Open link'}
  //           >
  //             {form.values.content instanceof File ? (
  //               <>
  //                 <InsertDriveFile />
  //                 Download file
  //               </>
  //             ) : (
  //               <>
  //                 <LinkIcon />
  //                 Open link
  //               </>
  //             )}
  //           </abbr>
  //         ),
  //         key: '"open-link-or-download-file-button',
  //       }
  //     : null

  const updatedMoreButtonItems = [
    draftButton,
    shareButton,
    bookmarkButtonSmallScreen,
    // sendToMoodleButton,
    // addToCollectionButton,
    deleteButton,
    ...(moreButtonItems ?? []),
  ].filter((item): item is FloatingMenuContentItem => !!item)

  const moreButton =
    updatedMoreButtonItems.length > 0 ? (
      // updatedMoreButtonItems.length === 1 ? (
      //   updatedMoreButtonItems.map(i => (
      //     <TertiaryButton key={i.key} abbr={i.text} onClick={i.onClick}>
      //       {i.Icon}
      //     </TertiaryButton>
      //   ))
      // ) : (
      <FloatingMenu
        className="more-button"
        key="more-button"
        menuContent={
          updatedMoreButtonItems.map(i => (
            <div key={i.key} onClick={i.onClick} tabIndex={0}>
              {i.Icon}
              {i.text}
            </div>
          ))
          // <div tabIndex={0} onClick={() => setIsReporting(true)}>
          //   <Flag />
          //   <Trans>Report</Trans>
          // </div>,
        }
        hoverElement={
          <TertiaryButton className={`more`} abbr="More options">
            <MoreVert />
          </TertiaryButton>
        }
      />
    ) : // )
    null

  const updatedTopRightHeaderItems = [
    followersButton,
    publishedButton,
    publishingButton,
    publishButton,
    bookmarkButtonBigScreen,
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

  const collectionHeader = (
    <div className="collection-header" key="collection-header">
      {updatedHeaderColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </div>
  )

  const collectionUploader = canEdit ? (
    <UploadImage
      form={form}
      imageOnClick={() => setIsShowingImage(true)}
      key="collection-uploader"
    />
  ) : null

  const imageDiv = (
    <div
      className="image"
      onClick={() => setIsShowingImage(true)}
      // style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
  )

  const imageContainer = !canEdit ? (
    form.values.content && form.values.image ? (
      <div className="image-container" key="image-container">
        {imageDiv}
        {/* {getImageCredits(form.values.image)} */}
      </div>
    ) : null
  ) : null

  // const searchImageComponent = isSearchingImage && (
  //   <SearchImage onClose={() => setIsSearchingImage(false)} setImage={setImage} />
  // )

  const descriptionEditRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)

  const [alwaysFullDescription, setAlwaysFullDescription] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(true)
  // const [isSmallDescription, setIsSmallDescription] = useState(false)

  useEffect(() => {
    const fieldElem = descriptionRef.current ?? descriptionEditRef.current
    if (fieldElem) {
      canEdit && fieldElem.scrollHeight < 80 && setAlwaysFullDescription(true)
      setShowFullDescription(alwaysFullDescription || fieldElem.scrollHeight < 80)
    }
  }, [
    descriptionRef.current?.scrollHeight,
    descriptionEditRef.current?.scrollHeight,
    alwaysFullDescription,
    canEdit,
  ])

  const description = (
    // form.values.content ? (
    <div
      className="description"
      style={{
        pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
        height: showFullDescription ? 'fit-content' : '66px',
        overflow: showFullDescription ? 'auto' : 'hidden',
      }}
    >
      {canEdit ? (
        <InputTextField
          className="description underline"
          name="description"
          isTextarea
          ref={descriptionEditRef}
          textAreaAutoSize
          displayMode
          key="description"
          placeholder="Description"
          value={form.values.description}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.description}
        />
      ) : (
        <div
          key="description"
          className="description-text"
          ref={descriptionRef}
          // style={{
          //   height: showFullDescription ? 'fit-content' : '66px',
          //   overflow: showFullDescription ? 'auto' : 'hidden',
          //   // paddingBottom: showFullDescription && !isSmallDescription ? '20px' : 0,
          // }}
        >
          {form.values.description}
        </div>
      )}
      {!showFullDescription && (
        <div className="see-more" onClick={() => setShowFullDescription(true)}>
          ...see more
        </div>
      )}
    </div>
  )

  const followButton = !isOwner ? (
    followed ? (
      <SecondaryButton
        disabled={!isAuthenticated}
        onClick={toggleFollow}
        className="following-button"
        key="follow-button"
        abbr="Unfollow"
        color="orange"
      >
        Following
      </SecondaryButton>
    ) : (
      <PrimaryButton
        disabled={!isAuthenticated}
        onClick={toggleFollow}
        key="follow-button"
        className="follow-button"
        abbr="Follow"
      >
        Follow
      </PrimaryButton>
    )
  ) : null

  const updatedFooterRowItems = [followButton, ...(footerRowItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const collectionFooter =
    updatedFooterRowItems.length > 0 ? (
      <div className="collection-footer" key="collection-footer">
        {updatedFooterRowItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    ) : null

  const updatedMainColumnItems = [
    imageContainer,
    collectionUploader,
    collectionHeader,
    description,
    collectionFooter,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

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
          <img src={imageUrl} alt="Collection" />
          {getImageCredits(form.values.image)}
        </Modal>
      )}
      {isToDelete && deleteCollection && (
        <Modal
          title={`Alert`}
          actions={
            <PrimaryButton
              onClick={() => {
                deleteCollection()
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
          The collection will be deleted
        </Modal>
      )}
    </>
  )
  return (
    <>
      {modals}
      {snackbars}
      {/* {searchImageComponent} */}
      <Card className="main-collection-card" hideBorderWhenSmall={true}>
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    </>
  )
}
MainCollectionCard.displayName = 'MainCollectionCard'
export default MainCollectionCard

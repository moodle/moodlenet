import { Share } from '@material-ui/icons'
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
} from '@moodlenet/component-library'
import { FormikHandle, getBackupImage, useImageUrl } from '@moodlenet/react-app/ui'
import {
  CloudDoneOutlined,
  Delete,
  HourglassBottom,
  MoreVert,
  Public,
  PublicOff,
  Sync,
} from '@mui/icons-material'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import {
  CollectionAccessProps,
  CollectionActions,
  CollectionDataProps,
  CollectionFormProps,
  CollectionStateProps,
} from '../../../../common/types.mjs'
import { UploadImage } from '../UploadImage/UploadImage.js'
import './MainCollectionCard.scss'

export type MainCollectionCardSlots = {
  mainColumnItems?: AddonItem[]
  headerColumnItems?: AddonItem[]
  topLeftHeaderItems?: AddonItem[]
  topRightHeaderItems?: AddonItem[]
  moreButtonItems?: FloatingMenuContentItem[]
  footerRowItems?: AddonItem[]
}

export type MainCollectionCardProps = {
  slots: MainCollectionCardSlots

  data: CollectionDataProps
  form: FormikHandle<CollectionFormProps>
  imageForm: FormikHandle<{ image: File | null }>

  state: CollectionStateProps
  actions: CollectionActions
  access: CollectionAccessProps

  shouldShowErrors: boolean
  publish: () => void
  isSaving: boolean
}

export const MainCollectionCard: FC<MainCollectionCardProps> = ({
  slots,

  data,
  form,
  imageForm,

  state,
  actions,
  access,

  shouldShowErrors,
  publish,
  isSaving,
}) => {
  const {
    mainColumnItems,
    headerColumnItems,
    topLeftHeaderItems,
    topRightHeaderItems,
    moreButtonItems,
    footerRowItems,
  } = slots

  const {
    collectionId,
    mnUrl,
    imageUrl,
    isWaitingForApproval,
    //  numFollowers,
  } = data

  const {
    isPublished,
    // bookmarked,
    // followed,
  } = state

  const {
    //  toggleBookmark,
    //  toggleFollow,
    unpublish,
    deleteCollection,
  } = actions
  const {
    canPublish,
    canDelete,
    canEdit,
    //  canFollow,
    //  canBookmark,
    //  isCreator,
    //  isAuthenticated
  } = access

  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
  const backupImage: string | undefined = useMemo(
    () => getBackupImage(collectionId),
    [collectionId],
  )
  const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  const [image] = useImageUrl(imageUrl, backupImage)
  // const { width } = useWindowDimensions()

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
      textAreaAutoSize
      displayMode
      className="title underline"
      value={form.values.title}
      placeholder="Title"
      key="title"
      onChange={form.handleChange}
      style={{
        pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
      }}
      error={shouldShowErrors && form.errors.title}
    />
  ) : (
    <div className="title" key="title">
      {form.values.title}
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
    collectionLabel,
    savingFeedback,
    ...(topLeftHeaderItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  // const followersButton =
  //   isPublished || numFollowers > 0 ? (
  //     <TertiaryButton
  //       className={`follow ${followed ? 'followed' : ''}`}
  //       disabled={!canFollow}
  //       onClick={canFollow ? toggleFollow : () => undefined}
  //       abbr={
  //         isCreator
  //           ? 'Creators cannot follow their own content'
  //           : !isAuthenticated
  //           ? 'Login or signup to follow'
  //           : followed
  //           ? 'Unfollow'
  //           : 'Follow'
  //       }
  //       key="followers-button"
  //     >
  //       {followed ? <Person /> : <PermIdentity />}
  //       <span>{numFollowers}</span>
  //     </TertiaryButton>
  //   ) : null

  const empty = !form.values.title && !form.values.description && !imageForm.values.image

  // const bookmarkButtonSmallScreen =
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

  const shareButton: FloatingMenuContentItem | null = isPublished
    ? {
        key: 'share-button',
        onClick: copyUrl,
        text: 'Share',
        Icon: <Share />,
      }
    : null

  const deleteButton: FloatingMenuContentItem | null =
    !empty && canDelete
      ? {
          key: 'delete-button',
          onClick: () => setIsToDelete(true),
          text: 'Delete',
          Icon: <Delete />,
        }
      : null

  const unpublishButton: FloatingMenuContentItem | null =
    canPublish && (isPublished || isWaitingForApproval)
      ? {
          Icon: <PublicOff />,
          text: 'Unpublish',
          key: 'unpublish-button',
          onClick: unpublish,
        }
      : null

  const publishButton: FloatingMenuContentItem | null =
    canPublish && !isPublished && !isWaitingForApproval
      ? {
          Icon: <Public style={{ fill: '#00bd7e' }} />,
          text: 'Publish',
          key: 'publish-button',
          onClick: publish,
        }
      : null

  const publishingButton =
    canPublish && !isPublished && isWaitingForApproval ? (
      <abbr key="publishing-button" title="Publish requested" style={{ cursor: 'initial' }}>
        <HourglassBottom style={{ fill: '#d0d1db' }} />
      </abbr>
    ) : null

  const publishedButton =
    canEdit && isPublished ? (
      <abbr title="Published" key="publishing-button" style={{ cursor: 'initial' }}>
        <Public style={{ fill: '#00bd7e' }} />
      </abbr>
    ) : null

  const unpublishedButton =
    canEdit && !isPublished ? (
      <abbr title="Unpublished" key="unpublished-button" style={{ cursor: 'initial' }}>
        <PublicOff style={{ fill: '#a7a7a7' }} />
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
    publishButton,
    unpublishButton,
    shareButton,
    // bookmarkButtonSmallScreen,
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
    publishedButton,
    unpublishedButton,
    publishingButton,
    // followersButton,
    // bookmarkButtonBigScreen,
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
      imageForm={imageForm}
      imageUrl={imageUrl}
      imageOnClick={() => setIsShowingImage(true)}
      key="collection-uploader"
    />
  ) : null

  const imageDiv = (
    <div
      className="image"
      onClick={() => setIsShowingImage(true)}
      // style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
      style={{ backgroundImage: `url(${image})` }}
    />
  )

  const imageContainer = !canEdit ? (
    imageForm.values.image || imageUrl ? (
      <div className="image-container" key="image-container">
        {imageDiv}
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
      setShowFullDescription(canEdit || alwaysFullDescription || fieldElem.scrollHeight < 80)
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
      className="description-container"
      key="description-container"
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
      {!showFullDescription && !canEdit && (
        <div className="see-more" onClick={() => setShowFullDescription(true)}>
          ...see more
        </div>
      )}
    </div>
  )

  // const followButton = !isCreator ? (
  //   followed ? (
  //     <SecondaryButton
  //       disabled={!canFollow}
  //       onClick={toggleFollow}
  //       className="following-button"
  //       key="follow-button"
  //       color="orange"
  //     >
  //       Following
  //     </SecondaryButton>
  //   ) : (
  //     <PrimaryButton
  //       disabled={!canFollow}
  //       onClick={toggleFollow}
  //       key="follow-button"
  //       className="follow-button"
  //       abbr={
  //         isCreator
  //           ? 'Creators cannot follow their own content'
  //           : !isAuthenticated
  //           ? 'Login or signup to follow'
  //           : followed
  //           ? 'Unfollow'
  //           : 'Follow'
  //       }
  //     >
  //       Follow
  //     </PrimaryButton>
  //   )
  // ) : null

  const updatedFooterRowItems = [
    // followButton,
    ...(footerRowItems ?? []),
  ].filter((item): item is AddonItem => !!item)

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
      {isShowingImage /* && image */ && (
        <Modal
          className="image-modal"
          closeButton={false}
          onClose={() => setIsShowingImage(false)}
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            // maxHeight: form.values.type !== '' ? 'calc(90% + 20px)' : '90%',
          }}
        >
          <img src={image} alt="Collection" />
          {/* {getImageCredits(form.values.image)} */}
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

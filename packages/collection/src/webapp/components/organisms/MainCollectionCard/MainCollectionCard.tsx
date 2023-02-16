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
} from '@moodlenet/component-library'
import { AssetInfo } from '@moodlenet/react-app/common'
import { FormikHandle, getBackupImage, useImageUrl } from '@moodlenet/react-app/ui'
import {
  CloudDoneOutlined,
  Delete,
  MoreVert,
  PermIdentity,
  Person,
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
  publish: () => void
  deleteCollection?(): unknown
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
  isPublished,
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
  // const { width } = useWindowDimensions()

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

  const title: AddonItem | null = {
    Item: () => (
      // form.values.content ? (
      <>
        {canEdit ? (
          <InputTextField
            name="name"
            isTextarea
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
          <div className="title">{form.values.name}</div>
        )}
      </>
    ),
    // ) : (
    //   <></>
    // ),
    key: 'type-and-actions',
  }

  //   const tagsDiv: AddonItem = {
  //     Item: () =>
  //       tags.length > 0 ? <div className="tags scroll">{getTagList(tags, 'medium')}</div> : <></>,
  //     key: 'type-and-actions',
  //   }

  const collectionLabel = {
    Item: () => <div className="collection-label">Collection</div>,
    key: 'collection-label',
  }

  const savingFeedback = isSaving
    ? {
        Item: () => (
          <abbr className="saving-feedback" title="Saving">
            <Sync />
            {/* Saving */}
          </abbr>
        ),
        key: 'saving-feedback',
      }
    : null

  const savedFeedback =
    !isSaving && isSaved
      ? {
          Item: () => {
            // const [showSavedText, setShowSavedText] = useState(true)
            // setTimeout(() => setShowSavedText(false), 3000)
            return (
              <abbr className="saved-feedback" title="Saved">
                <CloudDoneOutlined />
                {/* {showSavedText && 'Saved'} */}
              </abbr>
            )
          },
          key: 'saved-feedback',
        }
      : null

  const updatedTopLeftHeaderItems = [
    collectionLabel,
    savingFeedback,
    savedFeedback,
    ...(topLeftHeaderItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const followersButton = isPublished
    ? {
        Item: () => (
          <TertiaryButton
            className={`follow ${followed ? 'followed' : ''}`}
            disabled={!isAuthenticated || isOwner}
            onClick={isAuthenticated && !isOwner && toggleFollow ? toggleFollow : () => undefined}
            abbr={followed ? 'Unfollow' : 'Follow'}
          >
            {followed ? <Person /> : <PermIdentity />}
            <span>{numFollowers}</span>
          </TertiaryButton>
        ),
        key: 'followers-button',
      }
    : null

  const bookmarkButton = {
    Item: () =>
      isAuthenticated ? (
        <TertiaryButton
          className={`bookmark ${bookmarked && 'bookmarked'}`}
          onClick={toggleBookmark}
          abbr={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          {bookmarked ? <Bookmark /> : <BookmarkBorder />}
        </TertiaryButton>
      ) : (
        <></>
      ),
    key: 'bookmark-button',
  }

  const shareButton: FloatingMenuContentItem | null = {
    key: 'share-button',
    onClick: copyUrl,
    text: 'Share',
    Icon: <Share />,
  }

  const deleteButton: AddonItem | null = canEdit
    ? {
        Item: () => (
          <abbr key="delete-button" tabIndex={0} onClick={() => setIsToDelete(true)} title="Delete">
            <Delete />
            Delete
          </abbr>
        ),

        key: 'delete-button',
      }
    : null

  // const publishButton: AddonItem | null =
  //   width < 800 && canEdit && !isPublished && !isWaitingForApproval
  //     ? {
  //         Item: () => (
  //           <abbr key="publish-button" tabIndex={0} onClick={publish} title="Publish collection">
  //             <Public />
  //             Publish
  //           </abbr>
  //         ),

  //         key: 'publish-button',
  //       }
  //     : null

  // const draftButton: AddonItem | null =
  //   width < 800 && canEdit && (isPublished || isWaitingForApproval)
  //     ? {
  //         Item: () => (
  //           <abbr
  //             key="draft-button"
  //             tabIndex={0}
  //             onClick={() => setIsPublished(false)}
  //             title="Back to draft"
  //           >
  //             <PublicOff />
  //             Back to draft
  //           </abbr>
  //         ),
  //         key: 'draft-button',
  //       }
  //     : null

  // const publishingButton: AddonItem | null =
  //   width < 800 && canEdit && !isPublished && isWaitingForApproval
  //     ? {
  //         Item: () => (
  //           <abbr key="publishing-button" title="Publish requested" style={{ cursor: 'initial' }}>
  //             <HourglassBottom style={{ fill: '#d0d1db' }} />
  //           </abbr>
  //         ),

  //         key: 'publishing-button',
  //       }
  //     : null

  // const isPublishedButton: AddonItem | null =
  //   width < 800 && canEdit && isPublished
  //     ? {
  //         Item: () => (
  //           <abbr title="Collection isPublished" style={{ cursor: 'initial' }}>
  //             <Public style={{ fill: '#00bd7e' }} />
  //           </abbr>
  //         ),
  //         key: 'publishing-button',
  //       }
  //     : null

  // const sendToMoodleButton: AddonItem | null =
  //   width < 800 && form.values.content
  //     ? {
  //         Item: () => (
  //           <div key="send-to-moodle-button" tabIndex={0} onClick={() => setisPublished(false)}>
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
    // publishButton,
    // draftButton,
    shareButton,
    // sendToMoodleButton,
    // addToCollectionButton,
    deleteButton,
    ...(moreButtonItems ?? []),
  ].filter((item): item is FloatingMenuContentItem => !!item)

  const moreButton: AddonItem | null =
    updatedMoreButtonItems.length > 0
      ? updatedMoreButtonItems.length === 1
        ? {
            Item: () => (
              <>
                {updatedMoreButtonItems.map(i => {
                  return (
                    <TertiaryButton key={i.key} abbr={i.text} onClick={i.onClick}>
                      {i.Icon}
                    </TertiaryButton>
                  )
                })}
              </>
            ),
            key: 'more-button',
          }
        : {
            Item: () => (
              <FloatingMenu
                className="more-button"
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
            ),
            key: 'more-button',
          }
      : null

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
    followersButton,
    bookmarkButton,
    // isPublishedButton,
    // publishingButton,
    // deleteButton,
    // editSaveButton,
    ...(topRightHeaderItems ?? []),
    moreButton,
  ].filter((item): item is AddonItem => !!item)

  const topHeaderRow: AddonItem = {
    Item: () => (
      <div className="top-header-row">
        <div className="top-left-header">
          {updatedTopLeftHeaderItems.map(i => (
            <i.Item key={i.key} />
          ))}
        </div>
        <div className="top-right-header">
          {updatedTopRightHeaderItems.map(i => (
            <i.Item key={i.key} />
          ))}
        </div>
      </div>
    ),
    key: 'top-header-row',
  }

  const updatedHeaderColumnItems = [
    topHeaderRow,
    title,
    // tagsDiv,
    ...(headerColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const collectionHeader: AddonItem = {
    Item: () => (
      <div className="collection-header">
        {updatedHeaderColumnItems.map(i => (
          <i.Item key={i.key} />
        ))}
      </div>
    ),
    key: 'collection-header',
  }

  const collectionUploader: AddonItem | null = canEdit
    ? {
        Item: () => <UploadImage form={form} imageOnClick={() => setIsShowingImage(true)} />,
        key: 'collection-uploader',
      }
    : null

  const imageDiv = (
    <div
      className="image"
      onClick={() => setIsShowingImage(true)}
      // style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
  )

  const imageContainer: AddonItem | null = !canEdit
    ? {
        Item: () =>
          form.values.content && form.values.image ? (
            <div className="image-container">
              {imageDiv}
              {/* {getImageCredits(form.values.image)} */}
            </div>
          ) : (
            <></>
          ),
        key: 'image-container',
      }
    : null

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

  const description: AddonItem = {
    Item: () => (
      // form.values.content ? (
      <>
        {canEdit ? (
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
        )}
      </>
    ),
    key: 'description',
  }

  const followButton: AddonItem | null = !isOwner
    ? {
        Item: () =>
          followed ? (
            <SecondaryButton
              disabled={!isAuthenticated}
              onClick={toggleFollow}
              className="following-button"
              abbr="Unfollow"
              color="orange"
            >
              Following
            </SecondaryButton>
          ) : (
            <PrimaryButton
              disabled={!isAuthenticated}
              onClick={toggleFollow}
              className="follow-button"
              abbr="Follow"
            >
              Follow
            </PrimaryButton>
          ),
        key: 'follow-button',
      }
    : null

  const updatedFooterRowItems = [followButton, ...(footerRowItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const collectionFooter: AddonItem = {
    Item: () => (
      <div className="collection-footer">
        {updatedFooterRowItems.map(i => (
          <i.Item key={i.key} />
        ))}
      </div>
    ),
    key: 'collection-footer',
  }

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
        {updatedMainColumnItems.map(i => (
          <i.Item key={i.key} />
        ))}
      </Card>
    </>
  )
}
MainCollectionCard.displayName = 'MainCollectionCard'
export default MainCollectionCard

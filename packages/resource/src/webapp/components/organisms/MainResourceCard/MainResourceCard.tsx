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
  AddToPhotos,
  Delete,
  HourglassBottom,
  InsertDriveFile,
  MoreVert,
  Public,
  PublicOff,
} from '@mui/icons-material'
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import { getResourceTypeInfo, ResourceFormValues, ResourceType } from '../../../../common/types.mjs'
import { ReactComponent as MoodleIcon } from '../../../assets/icons/m-of-moodle.svg'
import { UploadResource } from '../UploadResource/UploadResource.js'
import './MainResourceCard.scss'

export type MainResourceCardProps = {
  mainColumnItems?: AddonItem[]
  headerColumnItems?: AddonItem[]
  topLeftHeaderItems?: AddonItem[]
  topRightHeaderItems?: AddonItem[]
  moreButtonItems?: AddonItem[]
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
  deleteResource,
  isPublished,
  setIsPublished,
  isWaitingForApproval,
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

  const title: AddonItem | null = {
    Item: () => (
      // form.values.content ? (
      <>
        {canEdit ? (
          <InputTextField
            name="name"
            textarea
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

  const resourceLabel = {
    Item: () => <div className="resource-label">Resource</div>,
    key: 'resource-label',
  }

  const typePill = {
    Item: () =>
      type && (
        <div
          className="type-pill"
          style={{
            background: typeColor,
          }}
        >
          {typeName}
        </div>
      ),
    key: 'type-pill',
  }

  const updatedTopLeftHeaderItems = [resourceLabel, typePill, ...(topLeftHeaderItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const likeButton = {
    Item: () => (
      <div
        className={`like ${isAuthenticated && !isOwner ? '' : 'disabled'} ${liked && 'liked'}`}
        onClick={isAuthenticated && !isOwner && toggleLike ? toggleLike : () => undefined}
      >
        {liked ? <Favorite /> : <FavoriteBorder />}
        <span>{numLikes}</span>
      </div>
    ),
    key: 'like-button',
  }

  const bookmarkButton = {
    Item: () =>
      isAuthenticated ? (
        <div className={`bookmark ${bookmarked && 'bookmarked'}`} onClick={toggleBookmark}>
          {bookmarked ? <Bookmark /> : <BookmarkBorder />}
        </div>
      ) : (
        <></>
      ),
    key: 'bookmark-button',
  }

  const shareButton: AddonItem | null = {
    Item: () => (
      <div key="share-button" tabIndex={0} onClick={copyUrl}>
        <Share />
        Share
      </div>
    ),
    key: 'share-button',
  }

  const deleteButton: AddonItem = {
    Item: () => (
      <div key="delete-button" tabIndex={0} onClick={() => setIsToDelete(true)}>
        <Delete />
        Delete
      </div>
    ),

    key: 'delete-button',
  }

  const publishButton: AddonItem | null =
    width < 800 && canEdit && !isPublished && !isWaitingForApproval
      ? {
          Item: () => (
            <div key="publish-button" tabIndex={0} onClick={() => setIsPublished(true)}>
              <Public />
              Publish
            </div>
          ),

          key: 'publish-button',
        }
      : null

  const draftButton: AddonItem | null =
    width < 800 && canEdit && (isPublished || isWaitingForApproval)
      ? {
          Item: () => (
            <div key="draft-button" tabIndex={0} onClick={() => setIsPublished(false)}>
              <PublicOff />
              Back to draft
            </div>
          ),
          key: 'draft-button',
        }
      : null

  const publishingButton: AddonItem | null =
    width < 800 && canEdit && !isPublished && isWaitingForApproval
      ? {
          Item: () => (
            <abbr key="publishing-button" title="Publish requested" style={{ cursor: 'initial' }}>
              <HourglassBottom style={{ fill: '#d0d1db' }} />
            </abbr>
          ),

          key: 'publishing-button',
        }
      : null

  const publishedButton: AddonItem | null =
    width < 800 && canEdit && isPublished
      ? {
          Item: () => (
            <abbr title="Published" style={{ cursor: 'initial' }}>
              <Public style={{ fill: '#00bd7e' }} />
            </abbr>
          ),
          key: 'publishing-button',
        }
      : null

  const sendToMoodleButton: AddonItem | null =
    width < 800 && form.values.content
      ? {
          Item: () => (
            <div key="send-to-moodle-button" tabIndex={0} onClick={() => setIsPublished(false)}>
              <MoodleIcon />
              Send to Moodle
            </div>
          ),
          key: 'send-to-moodle-button',
        }
      : null

  const addToCollectionButton: AddonItem | null =
    width < 800 && form.values.content && isAuthenticated
      ? {
          Item: () => (
            <div key="add-to-collection-button" tabIndex={0} onClick={() => setIsPublished(false)}>
              <AddToPhotos />
              Add to collection
            </div>
          ),
          key: 'add-to-collection-button',
        }
      : null

  const openLinkOrDownloadFile: AddonItem | null =
    width < 800 && form.values.content
      ? {
          Item: () => (
            <div
              key="open-link-or-download-file-button"
              tabIndex={0}
              onClick={() => setIsPublished(false)}
            >
              {form.values.content instanceof File ? (
                <>
                  <InsertDriveFile />
                  Download file
                </>
              ) : (
                <>
                  <LinkIcon />
                  Open link
                </>
              )}
            </div>
          ),
          key: '"open-link-or-download-file-button',
        }
      : null

  const updatedMoreButtonItems = [
    publishButton,
    draftButton,
    openLinkOrDownloadFile,
    shareButton,
    sendToMoodleButton,
    addToCollectionButton,
    deleteButton,
    ...(moreButtonItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const moreButton: AddonItem | null =
    updatedMoreButtonItems.length > 0
      ? {
          Item: () => (
            <FloatingMenu
              className="more-button"
              menuContent={
                updatedMoreButtonItems.map(i => (
                  <i.Item key={i.key} />
                ))
                // <div tabIndex={0} onClick={() => setIsReporting(true)}>
                //   <Flag />
                //   <Trans>Report</Trans>
                // </div>,
              }
              hoverElement={
                <TertiaryButton className={`more`}>
                  <MoreVert />
                </TertiaryButton>
              }
              abbr="More options"
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
    likeButton,
    bookmarkButton,
    publishedButton,
    publishingButton,
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

  const resourceHeader: AddonItem = {
    Item: () => (
      <div className="resource-header">
        {updatedHeaderColumnItems.map(i => (
          <i.Item key={i.key} />
        ))}
      </div>
    ),
    key: 'resource-header',
  }

  const resourceUploader = {
    Item: () => <UploadResource form={form} fileMaxSize={fileMaxSize} />,
    key: 'resource-uploader',
  }

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

  const imageContainer: AddonItem | null = !canEdit
    ? {
        Item: () =>
          form.values.content && form.values.image ? (
            <div className="image-container">
              {contentType === 'link' ? (
                <a href={contentUrl} target="_blank" rel="noreferrer">
                  {imageDiv}
                </a>
              ) : (
                <>{imageDiv}</>
              )}
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

  const description: AddonItem = {
    Item: () => (
      // form.values.content ? (
      <>
        {canEdit ? (
          <InputTextField
            className="description underline"
            name="description"
            textarea
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
          <div className="description"> {form.values.description} </div>
        )}
      </>
    ),
    // ) : (
    //   <></>
    // ),
    key: 'description',
  }

  const updatedFooterRowItems = [...(footerRowItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const resourceFooter: AddonItem = {
    Item: () => (
      <div className="resource-footer">
        {updatedFooterRowItems.map(i => (
          <i.Item key={i.key} />
        ))}
      </div>
    ),
    key: 'resource-footer',
  }

  const updatedMainColumnItems = [
    resourceHeader,
    resourceUploader,
    imageContainer,
    description,
    resourceFooter,
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
        {updatedMainColumnItems.map(i => (
          <i.Item key={i.key} />
        ))}
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

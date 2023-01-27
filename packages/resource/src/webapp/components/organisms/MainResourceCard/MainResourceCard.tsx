import {
  Bookmark,
  BookmarkBorder,
  DeleteOutline,
  Edit,
  Favorite,
  FavoriteBorder,
  Save,
  Share,
} from '@material-ui/icons'
import {
  AddonItem,
  Card,
  FloatingMenu,
  InputTextField,
  Loading,
  Modal,
  PrimaryButton,
  RoundButton,
  SearchImage,
  SecondaryButton,
  Snackbar,
  TertiaryButton,
} from '@moodlenet/component-library'
import { AssetInfo } from '@moodlenet/react-app/common'
import { getBackupImage, useImageUrl } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC, useMemo, useRef, useState } from 'react'
import { getResourceTypeInfo, ResourceFormValues, ResourceType } from '../../../../common/types.mjs'
import './MainResourceCard.scss'

export type MainResourceCardProps = {
  mainColumnItems?: AddonItem[]
  headerColumnItems?: AddonItem[]
  topLeftHeaderItems?: AddonItem[]
  topRightHeaderItems?: AddonItem[]
  moreButtonItems?: AddonItem[]
  footerRowItems?: AddonItem[]

  resource: ResourceFormValues
  downloadFilename: string
  type: string
  editResource: (values: ResourceFormValues) => Promise<unknown>
  deleteResource?(): unknown

  isEditing?: boolean
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>
  isAuthenticated: boolean
  isOwner: boolean
  isAdmin: boolean
  canEdit: boolean
  autoImageAdded: boolean
  canSearchImage: boolean

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
  isEditing,
  setIsEditing,

  resource,
  editResource,
  deleteResource,
  id: resourceId,
  url: resourceUrl,
  contentType,
  type,
  // resourceFormat,
  contentUrl,
  numLikes,
  //   tags,

  isAuthenticated,
  canEdit,
  isAdmin,
  isOwner,
  autoImageAdded,
  canSearchImage,

  liked,
  toggleLike,
  bookmarked,
  toggleBookmark,
}) => {
  const form = useFormik<ResourceFormValues>({
    initialValues: resource,
    // validate: yup,
    onSubmit: values => {
      return editResource(values)
    },
  })

  const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
  const [isSearchingImage, setIsSearchingImage] = useState<boolean>(false)
  //   const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
  //     useState<boolean>(false)
  //   const [isAddingToCollection, setIsAddingToCollection] =
  //     useState<boolean>(false)
  //   const [isAddingToMoodleLms, setIsAddingToMoodleLms] =
  //     useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
  const backupImage: AssetInfo | null | undefined = useMemo(
    () => getBackupImage(resourceId),
    [resourceId],
  )
  //   const [isReporting, setIsReporting] = useState<boolean>(false)
  //   const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
  const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)

  const [imageUrl] = useImageUrl(form.values?.image?.location, backupImage?.location)

  const { typeName, typeColor } = getResourceTypeInfo(type)

  const handleOnEditClick = () => {
    setIsEditing && setIsEditing(true)
  }

  const handleOnSaveClick = () => {
    if (form.isValid) {
      form.submitForm()
      setShouldShowErrors(false)
      setIsEditing && setIsEditing(false)
    } else {
      setShouldShowErrors(true)
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(resourceUrl)
    setShowUrlCopiedAlert(false)
    setTimeout(() => {
      setShowUrlCopiedAlert(true)
    }, 100)
  }

  const uploadImageRef = useRef<HTMLInputElement>(null)
  const selectImage = () => {
    uploadImageRef.current?.click()
  }

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files?.item(0)
    if (selectedFile) {
      form.setFieldValue('image', { location: selectedFile })
    }
  }

  const setImage = (image: AssetInfo | undefined) => {
    form.setFieldValue('image', image)
  }

  const deleteImage = () => {
    form.setFieldValue('image', null)
  }

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

  const shareButton: AddonItem = {
    Item: () => (
      <div key="share-btn" tabIndex={0} onClick={copyUrl}>
        <Share />
        Share
      </div>
    ),
    key: 'share-button',
  }

  const updatedMoreButtonItems = [shareButton, ...(moreButtonItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const title: AddonItem = {
    Item: () =>
      canEdit ? (
        <InputTextField
          name="name"
          textarea
          textAreaAutoSize
          displayMode
          className="title underline"
          value={form.values.name}
          edit={isEditing}
          onChange={form.handleChange}
          style={{
            pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
          }}
          error={isEditing && shouldShowErrors && form.errors.name}
        />
      ) : (
        <div className="title">{form.values.name}</div>
      ),
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
    Item: () => (
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
    Item: () =>
      !isEditing ? (
        <div
          className={`like ${isAuthenticated && !isOwner ? '' : 'disabled'} ${liked && 'liked'}`}
          onClick={isAuthenticated && !isOwner && toggleLike ? toggleLike : () => undefined}
        >
          {liked ? <Favorite /> : <FavoriteBorder />}
          <span>{numLikes}</span>
        </div>
      ) : (
        <></>
      ),
    key: 'like-button',
  }

  const bookmarkButton = {
    Item: () =>
      isAuthenticated && !isEditing ? (
        <div className={`bookmark ${bookmarked && 'bookmarked'}`} onClick={toggleBookmark}>
          {bookmarked ? <Bookmark /> : <BookmarkBorder />}
        </div>
      ) : (
        <></>
      ),
    key: 'bookmark-button',
  }

  const moreButton = {
    Item: () =>
      isAuthenticated && !isOwner ? (
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
          hoverElement={<TertiaryButton className={`more`}>...</TertiaryButton>}
        />
      ) : (
        <></>
      ),
    key: 'more-button',
  }

  const editSaveButton = {
    Item: () =>
      isAdmin || isOwner ? (
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
      ) : (
        <></>
      ),
    key: 'edit-save-button',
  }

  const updatedTopRightHeaderItems = [
    likeButton,
    bookmarkButton,
    moreButton,
    editSaveButton,
    ...(topRightHeaderItems ?? []),
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

  const imageContainer: AddonItem = {
    Item: () =>
      form.values.image || isEditing ? (
        <div className="image-container">
          {contentType === 'link' ? (
            <a href={contentUrl} target="_blank" rel="noreferrer">
              {imageDiv}
            </a>
          ) : (
            <>{imageDiv}</>
          )}
          {/* {getImageCredits(form.values.image)} */}
          {isEditing && !form.isSubmitting && (
            <div className="image-actions">
              <input
                ref={uploadImageRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={uploadImage}
                hidden
              />
              {canSearchImage && (
                <RoundButton
                  className={`search-image-button ${form.isSubmitting ? 'disabled' : ''} ${
                    autoImageAdded ? 'highlight' : ''
                  }`}
                  type="search"
                  abbrTitle={`Search for an image`}
                  onClick={() => setIsSearchingImage(true)}
                />
              )}
              <RoundButton
                className={`change-image-button ${form.isSubmitting ? 'disabled' : ''}`}
                type="upload"
                abbrTitle={`Upload an image`}
                onClick={selectImage}
              />
              <RoundButton
                className={`delete-image ${form.isSubmitting ? 'disabled' : ''}`}
                type="cross"
                abbrTitle={`Delete image`}
                onClick={deleteImage}
              />
            </div>
          )}
        </div>
      ) : (
        <></>
      ),
    key: 'image-container',
  }

  const searchImageComponent = isSearchingImage && (
    <SearchImage onClose={() => setIsSearchingImage(false)} setImage={setImage} />
  )

  const description: AddonItem = {
    Item: () =>
      isOwner ? (
        <InputTextField
          className="description underline"
          name="description"
          textarea
          textAreaAutoSize
          displayMode
          edit={isEditing}
          value={form.values.description}
          onChange={form.handleChange}
          style={{
            pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
          }}
          error={isEditing && form.errors.description}
        />
      ) : (
        <div className="description"> {form.values.description} </div>
      ),
    key: 'description',
  }

  const deleteButton: AddonItem = {
    Item: () =>
      isEditing ? (
        <SecondaryButton color="red" onHoverColor="fill-red" onClick={() => setIsToDelete(true)}>
          <DeleteOutline />
        </SecondaryButton>
      ) : (
        <></>
      ),
    key: 'delete-button',
  }

  const updatedFooterRowItems = [deleteButton, ...(footerRowItems ?? [])].filter(
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
      {searchImageComponent}
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

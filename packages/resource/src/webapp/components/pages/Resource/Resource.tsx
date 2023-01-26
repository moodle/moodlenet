import {
  Bookmark,
  BookmarkBorder,
  DeleteOutline,
  Edit,
  Favorite,
  FavoriteBorder,
  InsertDriveFile,
  Link,
  Save,
  Share,
} from '@material-ui/icons'
import {
  AddonItem,
  Card,
  FloatingMenu,
  IconTextOptionProps,
  InputTextField,
  Loading,
  Modal,
  OptionItemProp,
  PrimaryButton,
  RoundButton,
  SearchImage,
  SecondaryButton,
  Snackbar,
  TertiaryButton,
  TextOptionProps,
} from '@moodlenet/component-library'
import { AssetInfo } from '@moodlenet/react-app/common'
import {
  FormikHandle,
  getBackupImage,
  getTagList,
  MainLayout,
  MainLayoutProps,
  SelectOptions,
  SelectOptionsMulti,
  useImageUrl,
} from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC, useMemo, useRef, useState } from 'react'
import { getResourceTypeInfo, ResourceFormValues, ResourceType } from '../../../../common/types.mjs'
import {
  ContributorCard,
  ContributorCardProps,
} from '../../molecules/ContributorCard/ContributorCard.js'
import { ContributorCardStoryProps } from '../../molecules/ContributorCard/ContributorCard.stories.js'
import './Resource.scss'

export type ResourceProps = {
  mainLayoutProps: MainLayoutProps
  mainColumnItems?: AddonItem[]
  sideColumnItems?: AddonItem[]
  moreButtonItems?: AddonItem[]

  resource: ResourceFormValues
  editResource: (values: ResourceFormValues) => Promise<unknown>

  isAuthenticated: boolean
  // isApproved: boolean
  isOwner: boolean
  isAdmin: boolean
  canEdit: boolean
  autoImageAdded: boolean
  canSearchImage: boolean
  liked: boolean
  bookmarked: boolean
  // form: FormikHandle<Omit<ResourceFormValues, 'addToCollections'>>

  toggleLike?(): unknown
  toggleBookmark?(): unknown
  deleteResource?(): unknown
  addToCollectionsForm: FormikHandle<{ collections: string[] }>
  sendToMoodleLmsForm: FormikHandle<{ site?: string }>

  // reportForm?: FormikHandle<{ comment: string }>

  // tags: FollowTag[]
  contributorCardProps: ContributorCardProps
  collections: SelectOptionsMulti<OptionItemProp>

  licenses: SelectOptions<IconTextOptionProps>
  setCategoryFilter(text: string): unknown
  categories: SelectOptions<TextOptionProps>
  setTypeFilter(text: string): unknown
  types: SelectOptions<TextOptionProps>
  setLevelFilter(text: string): unknown
  levels: SelectOptions<TextOptionProps>
  setLanguageFilter(text: string): unknown
  languages: SelectOptions<TextOptionProps>
  downloadFilename: string
  type: string
} & ResourceType

export const Resource: FC<ResourceProps> = ({
  mainLayoutProps,
  mainColumnItems,
  sideColumnItems,
  moreButtonItems,

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
  tags,

  isAuthenticated,
  // canEdit,
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
    // validate:yup,
    onSubmit: values => {
      return editResource(values)
    },
  })

  const [isEditing, setIsEditing] = useState<boolean>(
    // canSearchImage && autoImageAdded
    false,
  )
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
  // const [isEditing, toggleIsEditing] = useReducer(_ => !_, false)

  const [imageUrl] = useImageUrl(form.values?.image?.location, backupImage?.location)

  const { typeName, typeColor } = getResourceTypeInfo(type)

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

  const searchImageComponent = isSearchingImage && (
    <SearchImage onClose={() => setIsSearchingImage(false)} setImage={setImage} />
  )

  const mainResourceCard = {
    Item: () => (
      <Card className="main-resource-card" hideBorderWhenSmall={true}>
        <div className="resource-header">
          <div className="type-and-actions">
            <span className="resource-type">
              <div className="resource-label">Resource</div>
              <div
                className="type"
                style={{
                  background: typeColor,
                }}
              >
                {typeName}
              </div>
            </span>
            <div className="actions">
              {!isEditing && (
                <div
                  className={`like ${isAuthenticated && !isOwner ? '' : 'disabled'} ${
                    liked && 'liked'
                  }`}
                  onClick={isAuthenticated && !isOwner && toggleLike ? toggleLike : () => undefined}
                >
                  {liked ? <Favorite /> : <FavoriteBorder />}
                  <span>{numLikes}</span>
                </div>
              )}
              {isAuthenticated && !isEditing && (
                <div className={`bookmark ${bookmarked && 'bookmarked'}`} onClick={toggleBookmark}>
                  {bookmarked ? <Bookmark /> : <BookmarkBorder />}
                </div>
              )}
              {isAuthenticated && !isOwner && (
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
              )}
              {(isAdmin || isOwner) && (
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
              )}
            </div>
          </div>
          {isOwner ? (
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
          )}
          {tags.length > 0 && <div className="tags scroll">{getTagList(tags, 'medium')}</div>}
        </div>
        {(form.values.image || isEditing) && (
          <div className="image-container">
            {contentType === 'link' ? (
              <a href={contentUrl} target="_blank" rel="noreferrer">
                {imageDiv}
              </a>
            ) : (
              <>{imageDiv}</>
            )}
            {getImageCredits(form.values.image)}
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
        )}
        {isOwner ? (
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
        )}
        {isEditing && (
          <div className="bottom">
            <SecondaryButton
              color="red"
              onHoverColor="fill-red"
              onClick={() => setIsToDelete(true)}
            >
              <DeleteOutline />
            </SecondaryButton>
          </div>
        )}
      </Card>
    ),
    key: 'main-resource-card',
  }

  const contributorCard = {
    Item: () => <ContributorCard {...ContributorCardStoryProps} />,
    key: 'contributor-card',
  }

  const actions = {
    Item: () => (
      <Card className="resource-action-card" hideBorderWhenSmall={true}>
        <PrimaryButton
        // onClick={() => setIsAddingToMoodleLms(true)}
        >
          Send to Moodle
        </PrimaryButton>
        {/* {isAuthenticated && ( */}
        <SecondaryButton
        // onClick={() => setIsAddingToCollection(true)}
        >
          Add to Collection
        </SecondaryButton>
        <a
          // href={contentUrl}
          target="_blank"
          rel="noreferrer"
          // download={downloadFilename}
        >
          <SecondaryButton>
            {contentType === 'file' ? (
              <>
                <InsertDriveFile />
                Download file
              </>
            ) : (
              <>
                <Link />
                Open link
              </>
            )}
          </SecondaryButton>
        </a>
      </Card>
    ),
    key: 'actions',
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

  const updatedSideColumnItems = [contributorCard, actions, ...(sideColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const updatedMainColumnItems = [mainResourceCard, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )
  const updatedMoreButtonItems = [shareButton, ...(moreButtonItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

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
      {isShowingImage && imageUrl && (
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
    <MainLayout {...mainLayoutProps}>
      {modals}
      {snackbars}
      {searchImageComponent}
      <div className="resource">
        <div className="content">
          <div className="main-column">
            {updatedMainColumnItems.map(i => (
              <i.Item key={i.key} />
            ))}
          </div>
          <div className="side-column">
            {updatedSideColumnItems?.map(i => (
              <i.Item key={i.key} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
Resource.displayName = 'ResourcePage'
export default Resource

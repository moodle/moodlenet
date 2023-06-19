import { Share } from '@material-ui/icons'
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
} from '@moodlenet/component-library'
import type { FormikHandle } from '@moodlenet/react-app/ui'
import { getBackupImage, useImageUrl } from '@moodlenet/react-app/ui'
import { Delete, Edit, MoreVert, Public, PublicOff, Save } from '@mui/icons-material'
import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  CollectionAccessProps,
  CollectionActions,
  CollectionDataProps,
  CollectionFormProps,
  CollectionStateProps,
} from '../../../../common/types.mjs'
import { UploadImage } from '../UploadImage/UploadImage.js'
import './MainCollectionCard.scss'

export type MainCollectionCardSlots = {
  mainColumnItems: (AddonItem | null)[]
  headerColumnItems: (AddonItem | null)[]
  topLeftHeaderItems: (AddonItem | null)[]
  topRightHeaderItems: (AddonItem | null)[]
  moreButtonItems: (FloatingMenuContentItem | null)[]
  footerRowItems: (AddonItem | null)[]
}

export type MainCollectionCardProps = {
  slots: MainCollectionCardSlots

  data: CollectionDataProps
  collectionForm: CollectionFormProps
  form: FormikHandle<CollectionFormProps>
  imageForm: FormikHandle<{ image: File | string | undefined | null }>

  state: CollectionStateProps
  actions: CollectionActions
  access: CollectionAccessProps

  publish: () => void
  isSaving: boolean

  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>

  shouldShowErrors: boolean
  setShouldShowErrors: React.Dispatch<React.SetStateAction<boolean>>
}

export const MainCollectionCard: FC<MainCollectionCardProps> = ({
  slots,

  data,
  collectionForm,
  form,
  imageForm,

  state,
  actions,
  access,

  publish,
  isSaving,

  isEditing,
  setIsEditing,

  shouldShowErrors,
  setShouldShowErrors,
}) => {
  const {
    mainColumnItems,
    headerColumnItems,
    topLeftHeaderItems,
    topRightHeaderItems,
    moreButtonItems,
    footerRowItems,
  } = slots

  const { id, mnUrl, imageUrl } = data

  const { isPublished } = state

  const { unpublish, deleteCollection } = actions
  const { canPublish, canDelete, canEdit } = access

  const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
  const [updatedImage, setUpdatedImage] = useState<string | undefined>(imageUrl)
  const backupImage: string | undefined = useMemo(() => getBackupImage(id), [id])
  const [image] = useImageUrl(imageUrl, backupImage)
  const [imageFromForm] = useImageUrl(imageForm.values.image)
  const [isCurrentlySaving, setIsCurrentlySaving] = useState(false)
  const [isWaitingForSaving, setisWaitingForSaving] = useState(false)

  const handleOnEditClick = () => {
    setIsEditing(true)
    setShouldShowErrors(false)
    setIsCurrentlySaving(false)
    setisWaitingForSaving(false)
  }

  const handleOnSaveClick = () => {
    setisWaitingForSaving(true)
    setShouldShowErrors(false)
    form.submitForm()
    imageForm.submitForm()
  }

  console.log('isCurrentlySaving', isCurrentlySaving)
  console.log('isWaitingForSaving', isWaitingForSaving)

  useEffect(() => {
    if (isWaitingForSaving && isSaving) {
      setisWaitingForSaving(false)
      setIsCurrentlySaving(true)
    }
    if (!isSaving && isCurrentlySaving) {
      setIsCurrentlySaving(false)
      setIsEditing(false)
    }
  }, [
    form.isSubmitting,
    imageForm.isSubmitting,
    isCurrentlySaving,
    isSaving,
    isWaitingForSaving,
    setIsEditing,
  ])

  useEffect(() => {
    setUpdatedImage(imageUrl)
  }, [imageUrl])

  useEffect(() => {
    setUpdatedImage(imageFromForm)
  }, [imageFromForm])

  const copyUrl = () => {
    navigator.clipboard.writeText(mnUrl)
    setShowUrlCopiedAlert(false)
    setTimeout(() => {
      setShowUrlCopiedAlert(true)
    }, 100)
  }

  const title = canEdit ? (
    <InputTextField
      name="title"
      isTextarea
      textAreaAutoSize
      className="title underline"
      value={form.values.title}
      placeholder="Title"
      key="title"
      edit={isEditing}
      noBorder
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

  const collectionLabel = (
    <div className="collection-label" key="collection-label">
      Collection
    </div>
  )

  const updatedTopLeftHeaderItems = [
    collectionLabel,
    // savingFeedback,
    ...(topLeftHeaderItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const empty = !form.values.title && !form.values.description && !imageForm.values.image

  const shareButton: FloatingMenuContentItem | null = isPublished
    ? {
        Element: (
          <div key="share-button" onClick={copyUrl}>
            <Share />
            Share
          </div>
        ),
      }
    : null

  const deleteButton: FloatingMenuContentItem | null =
    !empty && canDelete
      ? {
          Element: (
            <div key="delete-button" onClick={() => setIsToDelete(true)}>
              <Delete />
              Delete
            </div>
          ),
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
        }
      : null

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

  const updatedMoreButtonItems = [
    publishButton,
    unpublishButton,
    shareButton,
    deleteButton,
    ...(moreButtonItems ?? []),
  ].filter((item): item is FloatingMenuContentItem => !!item)

  const moreButton =
    updatedMoreButtonItems.length > 0 ? (
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
            {isEditing && !isCurrentlySaving && (
              <PrimaryButton
                className={`${isCurrentlySaving ? 'loading' : ''}`}
                color="green"
                onClick={isCurrentlySaving ? handleOnEditClick : handleOnSaveClick}
              >
                <div
                  className="loading"
                  style={{
                    visibility: isCurrentlySaving ? 'visible' : 'hidden',
                  }}
                >
                  <Loading color="white" />
                </div>
                <div
                  className="label"
                  style={{
                    visibility: isCurrentlySaving ? 'hidden' : 'visible',
                  }}
                >
                  <Save />
                </div>
              </PrimaryButton>
            )}
            {isEditing && isCurrentlySaving && (
              <PrimaryButton className={`${'loading'}`} onClick={handleOnEditClick}>
                <div className="loading">
                  <Loading color="white" />
                </div>
              </PrimaryButton>
            )}
            {!isEditing && (
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
    publishedButton,
    unpublishedButton,
    ...(topRightHeaderItems ?? []),
    moreButton,
    editSaveButton,
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
      displayOnly={(canEdit && !isEditing) || !canEdit}
      imageForm={imageForm}
      imageUrl={updatedImage}
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

  const descriptionEditRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)

  const [alwaysFullDescription, setAlwaysFullDescription] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(true)

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
          noBorder
          edit={isEditing}
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

  const updatedFooterRowItems = [...(footerRowItems ?? [])].filter(
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
      {isShowingImage && (
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
          <img src={updatedImage ?? image} alt="Collection" />
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

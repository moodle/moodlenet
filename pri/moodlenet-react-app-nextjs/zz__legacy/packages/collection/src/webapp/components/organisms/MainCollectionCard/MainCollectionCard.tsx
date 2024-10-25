import type { AddonItem, FloatingMenuContentItem } from '@moodlenet/component-library'
import {
  Card,
  FloatingMenu,
  InputTextField,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  TertiaryButton,
} from '@moodlenet/component-library'
import type { AssetInfoForm } from '@moodlenet/component-library/common'
import type { FormikHandle } from '@moodlenet/react-app/ui'
import { Check, Delete, Edit, MoreVert, Public, PublicOff, Save, Share } from '@mui/icons-material'
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  CollectionAccessProps,
  CollectionActions,
  CollectionDataProps,
  CollectionFormProps,
  CollectionStateProps,
} from '../../../../common/types.mjs'
import { UploadImage } from '../UploadImage/UploadImage'
import './MainCollectionCard.scss'

export type MainCollectionCardSlots = {
  mainColumnItems: (AddonItem | null)[]
  headerColumnItems: (AddonItem | null)[]
  topLeftHeaderItems: (AddonItem | null)[]
  topRightHeaderItems: (AddonItem | null)[]
  moreButtonItems: (FloatingMenuContentItem | null)[]
  footerRowItems: (AddonItem | null)[]
}

export type ValidForms = {
  isDraftFormValid: boolean
  isPublishedFormValid: boolean
  isImageValid: boolean
}

export type MainCollectionCardProps = {
  slots: MainCollectionCardSlots

  data: CollectionDataProps
  form: FormikHandle<CollectionFormProps>
  imageForm: FormikHandle<{ image: AssetInfoForm | undefined | null }>

  state: CollectionStateProps
  actions: CollectionActions
  access: CollectionAccessProps

  publish: () => void
  publishCheck: () => void

  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  setIsPublishValidating: React.Dispatch<React.SetStateAction<boolean>>

  emptyOnStart: boolean
  setEmptyOnStart: React.Dispatch<React.SetStateAction<boolean>>

  isFormValid: ValidForms
  setFieldsAsTouched: () => void

  shouldShowErrors: boolean
  setShouldShowErrors: React.Dispatch<React.SetStateAction<boolean>>
}

export const MainCollectionCard: FC<MainCollectionCardProps> = ({
  slots,

  data,
  form,
  imageForm,

  state,
  actions,
  access,

  publish,
  publishCheck,

  isEditing,
  setIsEditing,
  setIsPublishValidating,

  emptyOnStart,
  setEmptyOnStart,

  isFormValid,
  setFieldsAsTouched,

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

  const { mnUrl, image } = data

  const { isPublished } = state

  const { unpublish, deleteCollection } = actions

  const { canPublish, canDelete, canEdit } = access

  const { isDraftFormValid, isPublishedFormValid, isImageValid } = isFormValid

  const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)

  const handleOnEditClick = () => {
    setIsEditing(true)
    setShouldShowErrors(false)
  }

  const form_submitForm = form.submitForm
  const imageForm_submitForm = imageForm.submitForm
  const imageForm_setFieldValue = imageForm.setFieldValue
  // const imageForm_validateForm = imageForm.validateForm

  const [isHandlingSaving, setIsHandlingSaving] = useState<boolean>(false)

  const handleOnSaveClick = () => {
    if (!form.dirty && !imageForm.dirty) {
      setIsEditing(false)
      return
    }
    setIsPublishValidating(isPublished)
    setIsHandlingSaving(true)
  }

  const applySave = useCallback(() => {
    const isFormValid = isPublished ? isPublishedFormValid : isDraftFormValid

    setFieldsAsTouched()
    !isImageValid && imageForm_setFieldValue('image', null)

    if (!isFormValid) {
      setShouldShowErrors(true)
      return
    }

    setShouldShowErrors(false)

    if (form.dirty) {
      form_submitForm()
    }

    if (imageForm.dirty) {
      imageForm.values.image !== image &&
        typeof imageForm.values.image?.location !== 'string' &&
        imageForm_submitForm()
    }

    setEmptyOnStart(false)
    setIsEditing(false)
  }, [
    form.dirty,
    form_submitForm,
    image,
    imageForm.dirty,
    imageForm.values.image,
    imageForm_setFieldValue,
    imageForm_submitForm,
    isDraftFormValid,
    isImageValid,
    isPublished,
    isPublishedFormValid,
    setEmptyOnStart,
    setFieldsAsTouched,
    setIsEditing,
    setShouldShowErrors,
  ])

  useEffect(() => {
    if (isHandlingSaving) {
      applySave()
      setIsHandlingSaving(false)
    }
  }, [isHandlingSaving, applySave])

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
      key="title"
      className="title"
      isTextarea
      value={form.values.title}
      placeholder="Title"
      edit={isEditing}
      onChange={form.handleChange}
      error={shouldShowErrors && isEditing && form.errors.title}
      textAreaAutoSize
      noBorder
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

  const updatedTopLeftHeaderItems = [collectionLabel, ...(topLeftHeaderItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

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

  const deleteButton: FloatingMenuContentItem | null = canDelete
    ? {
        Element: (
          <div
            className={`delete-button ${emptyOnStart ? 'disabled' : ''}`}
            key="delete-button"
            onClick={() => !emptyOnStart && setIsToDelete(true)}
          >
            <Delete /> Delete
          </div>
        ),
      }
    : null

  const unpublishButton: FloatingMenuContentItem | null =
    canPublish && isPublished
      ? {
          Element: (
            <div
              key="unpublish-button"
              onClick={() => {
                unpublish()
                setIsPublishValidating(false)
              }}
            >
              <PublicOff />
              Unpublish
            </div>
          ),
        }
      : null

  const publishButton: FloatingMenuContentItem | null =
    !isEditing && canPublish && !isPublished
      ? {
          Element: (
            <div key="publish-button" onClick={publish}>
              <Public style={{ fill: '#00bd7e' }} />
              Publish
            </div>
          ),
        }
      : null

  const publishCheckButton: FloatingMenuContentItem | null =
    isEditing && canPublish && !isPublished
      ? {
          Element: (
            <div key="publish-button" onClick={publishCheck}>
              <Check style={{ fill: '#00bd7e' }} />
              Publish check
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
    publishCheckButton,
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
            {isEditing && (
              <PrimaryButton
                color="green"
                onClick={handleOnSaveClick}
                disabled={empty && emptyOnStart}
              >
                <div className="label">
                  <Save />
                </div>
              </PrimaryButton>
            )}
            {/* {isEditing && isCurrentlySaving && (
              <PrimaryButton className={`${'loading'}`} onClick={handleOnEditClick}>
                <div className="loading">
                  <Loading color="white" />
                </div>
              </PrimaryButton>
            )} */}
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

  const collectionUploader =
    isEditing || imageForm.values.image ? (
      <UploadImage
        displayOnly={(canEdit && !isEditing) || !canEdit}
        imageForm={imageForm}
        // backupImage={backupImage}
        key="collection-uploader"
      />
    ) : null

  // const imageDiv = (
  //   <div
  //     className="image"
  //     onClick={() => setIsShowingImage(true)}
  //     // style={{ maxHeight: form.values.image ? 'fit-content' : '150px' }}
  //     style={{ backgroundImage: `url(${image})` }}
  //   />
  // )

  // const imageContainer = !canEdit ? (
  //   imageForm.values.image || imageUrl ? (
  //     <div className="image-container" key="image-container">
  //       {imageDiv}
  //     </div>
  //   ) : null
  // ) : null

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
        height: showFullDescription ? 'fit-content' : '66px',
        overflow: showFullDescription ? 'auto' : 'hidden',
      }}
    >
      {canEdit ? (
        <InputTextField
          className="description"
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
          error={shouldShowErrors && isEditing && form.errors.description}
        />
      ) : (
        <div key="description" className="description-text" ref={descriptionRef}>
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
    // imageContainer,
    collectionUploader,
    collectionHeader,
    description,
    collectionFooter,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const snackbars = (
    <>
      {showUrlCopiedAlert && (
        <Snackbar type="success" position="bottom" autoHideDuration={3000} showCloseButton={false}>
          Link copied to clipoard
        </Snackbar>
      )}
    </>
  )

  const modals = [
    isToDelete && deleteCollection && (
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
    ),
  ]

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

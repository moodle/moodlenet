import type { AddonItem, FloatingMenuContentItem } from '@moodlenet/component-library'
import {
  Card,
  FloatingMenu,
  InputTextField,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  SnackbarStack,
  TertiaryButton,
  useWindowDimensions,
} from '@moodlenet/component-library'
import type { AssetInfoForm } from '@moodlenet/component-library/common'
import type { LearningOutcomeOption } from '@moodlenet/ed-meta/common'
import { LearningOutcomes } from '@moodlenet/ed-meta/ui'
import type { FormikHandle } from '@moodlenet/react-app/ui'
import { downloadOrOpenURL, getTagList } from '@moodlenet/react-app/ui'
import {
  Check,
  Delete,
  Edit,
  InsertDriveFile,
  Link as LinkIcon,
  MoreVert,
  Public,
  PublicOff,
  Save,
  Share,
} from '@mui/icons-material'
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  EdMetaOptionsProps,
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
  uploadOptionsItems: (AddonItem | null)[]
}

export type ValidForms = {
  isDraftFormValid: boolean
  isPublishedFormValid: boolean
  isPublishedContentValid: boolean
  isDraftContentValid: boolean
  isImageValid: boolean
}

export type MainResourceCardProps = {
  slots: MainResourceCardSlots

  data: ResourceDataProps
  edMetaOptions: EdMetaOptionsProps
  form: FormikHandle<ResourceFormProps>
  contentForm: FormikHandle<{ content: File | string | undefined | null }>
  imageForm: FormikHandle<{ image: AssetInfoForm | undefined | null }>
  learningOutcomeOptions: LearningOutcomeOption[]

  state: ResourceStateProps
  actions: ResourceActions
  access: ResourceAccessProps

  publish: () => void
  unpublish: () => void
  publishCheck: () => void

  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  setIsPublishValidating: React.Dispatch<React.SetStateAction<boolean>>

  emptyOnStart: boolean
  setEmptyOnStart: React.Dispatch<React.SetStateAction<boolean>>

  areFormsValid: ValidForms
  shouldShowErrors: boolean
  setShouldShowErrors: React.Dispatch<React.SetStateAction<boolean>>

  setFieldsAsTouched: () => void
  fileMaxSize: number
}

export const MainResourceCard: FC<MainResourceCardProps> = ({
  slots,
  learningOutcomeOptions,
  data,
  edMetaOptions,
  form,
  contentForm,
  imageForm,

  state,
  actions,
  access,

  publish,
  unpublish,
  publishCheck,

  isEditing,
  setIsEditing,
  setIsPublishValidating,

  emptyOnStart,
  setEmptyOnStart,

  areFormsValid,
  setShouldShowErrors,
  shouldShowErrors,

  setFieldsAsTouched,
  fileMaxSize,
}) => {
  const {
    mainColumnItems,
    headerColumnItems,
    topLeftHeaderItems,
    topRightHeaderItems,
    moreButtonItems,
    footerRowItems,
    uploadOptionsItems,
  } = slots

  const { mnUrl, contentType, downloadFilename, contentUrl, subjectHref } = data

  const { subjectOptions } = edMetaOptions

  const { isPublished, uploadProgress } = state

  const { deleteResource } = actions

  const { canEdit, canPublish, canDelete } = access

  const {
    isDraftFormValid,
    isPublishedFormValid,
    isPublishedContentValid,
    isDraftContentValid,
    isImageValid,
  } = areFormsValid

  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  const [showSaveError, setShowSaveError] = useState<boolean>(false)
  const { width } = useWindowDimensions()

  const [currentContentUrl, setCurrentContentUrl] = useState<string | null>(contentUrl)

  const isFormValid = isPublished ? isPublishedFormValid : isDraftFormValid
  const isContentValid = isPublished ? isPublishedContentValid : isDraftContentValid

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

  const form_submitForm = form.submitForm
  const contentForm_submitForm = contentForm.submitForm
  const imageForm_submitForm = imageForm.submitForm
  const imageForm_validateForm = imageForm.validateForm
  const imageForm_setFieldValue = imageForm.setFieldValue
  const imageForm_setTouched = imageForm.setTouched

  const setImageField = useCallback(
    (image: AssetInfoForm | undefined | null) => {
      imageForm_setFieldValue('image', image).then(() => {
        imageForm_validateForm()
        imageForm_setTouched({ image: true })
      })
    },
    [imageForm_setFieldValue, imageForm_validateForm, imageForm_setTouched],
  )

  const handleOnEditClick = () => {
    setIsEditing(true)
    setIsPublishValidating(isPublished)
    setShouldShowErrors(false)
  }

  const [isHandlingSaving, setIsHandlingSaving] = useState<boolean>(false)

  const handleOnSaveClick = () => {
    if (!form.dirty && !imageForm.dirty && !contentForm.dirty) {
      setIsEditing(false)
      return
    }
    setIsPublishValidating(isPublished)
    setIsHandlingSaving(true)
  }

  const applySave = useCallback(() => {
    setFieldsAsTouched()
    !isImageValid && setImageField(null)

    if (!isFormValid || !isContentValid) {
      setShouldShowErrors(true)
      setShowSaveError(true)
      return
    }

    if (form.dirty) {
      form_submitForm()
    }

    if (contentForm.dirty) {
      contentForm.values.content !== contentUrl && contentForm_submitForm()
    }

    if (imageForm.dirty) {
      isImageValid && imageForm_submitForm()
    }

    setIsEditing(false)
    setEmptyOnStart(false)
  }, [
    contentForm.dirty,
    contentForm.values.content,
    contentForm_submitForm,
    contentUrl,
    form.dirty,
    form_submitForm,
    imageForm.dirty,
    imageForm_submitForm,
    isContentValid,
    isFormValid,
    isImageValid,
    setEmptyOnStart,
    setFieldsAsTouched,
    setImageField,
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
      className="title underline"
      isTextarea
      edit={isEditing}
      value={form.values.title}
      placeholder="Title"
      onChange={form.handleChange}
      error={shouldShowErrors && isEditing && form.errors.title}
      textAreaAutoSize
      noBorder
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
    contentForm.values.content && typeName && typeColor ? (
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

  const updatedTopLeftHeaderItems = [
    resourceLabel,
    typePill,
    // savingFeedback,
    ...(topLeftHeaderItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const empty =
    (!form.values.title || form.values.title === '') &&
    (!form.values.description || form.values.description === '') &&
    !(form.values.learningOutcomes.length > 0) &&
    !contentForm.values.content &&
    !imageForm.values.image

  const shareButton: FloatingMenuContentItem | null = isPublished
    ? {
        Element: (
          <div key="share-button" onClick={copyUrl}>
            <Share /> Share
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

  const publishButton: FloatingMenuContentItem | null =
    !isEditing && canPublish && !isPublished
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
    publishCheckButton,
    unpublishButton,
    openLinkOrDownloadFile,
    shareButton,
    deleteButton,
    ...(moreButtonItems ?? []),
  ].filter((item): item is FloatingMenuContentItem => !!item)

  const moreButton =
    updatedMoreButtonItems.length > 0 ? (
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
            {isEditing && (
              <PrimaryButton
                className={`save-button`}
                color="green"
                onClick={handleOnSaveClick}
                disabled={empty && emptyOnStart}
              >
                <div className="label">
                  <Save />
                </div>
              </PrimaryButton>
            )}
            {!isEditing && (
              <SecondaryButton className="edit-button" onClick={handleOnEditClick} color="orange">
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
      <div className="top-left-header" key="top-left-header">
        {updatedTopLeftHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
      <div className="top-right-header" key="top-right-header">
        {updatedTopRightHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    </div>
  )

  const subjectLabel = subjectOptions.find(
    ({ ['value']: value }) => value && value === form.values.subject,
  )

  const tagsContainer = subjectLabel ? (
    <div className="tags scroll" key="tags">
      {getTagList([{ name: subjectLabel.label, href: subjectHref, type: 'subject' }], 'small')}
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

  const resourceUploader = (imageForm.values.image || isEditing) && (
    <UploadResource
      displayOnly={(canEdit && !isEditing) || !canEdit}
      contentForm={contentForm}
      imageForm={imageForm}
      uploadOptionsItems={uploadOptionsItems}
      fileMaxSize={fileMaxSize}
      downloadFilename={downloadFilename}
      uploadProgress={uploadProgress}
      shouldShowErrors={shouldShowErrors}
      contentType={contentType}
      key="resource-uploader"
    />
  )

  const descriptionRef = useRef<HTMLDivElement>(null)
  const [showFullDescription, setShowFullDescription] = useState(true)

  useEffect(() => {
    const fieldElem = descriptionRef.current
    if (fieldElem) {
      {
        fieldElem.scrollHeight > 114 && setShowFullDescription(false)
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
      error={shouldShowErrors && isEditing && form.errors.description}
    />
  ) : (
    <div className="description" key="description-container">
      <div
        className="description-text"
        ref={descriptionRef}
        style={{
          height: showFullDescription ? 'fit-content' : '110px',
          overflow: showFullDescription ? 'auto' : 'hidden',
        }}
      >
        {form.values.description}
      </div>
      {!showFullDescription && (
        <div className="see-more" onClick={() => setShowFullDescription(true)}>
          ...see more
        </div>
      )}
    </div>
  )

  const outcomeErrors = form.errors.learningOutcomes

  const learningOutcomes =
    isEditing ||
    (!isEditing && form.values.learningOutcomes.filter(e => e.sentence !== '').length > 0) ? (
      <LearningOutcomes
        learningOutcomeOptions={learningOutcomeOptions}
        learningOutcomes={form.values.learningOutcomes}
        isEditing={isEditing}
        error={
          shouldShowErrors && isEditing && typeof outcomeErrors === 'string'
            ? outcomeErrors
            : Array.isArray(outcomeErrors)
            ? outcomeErrors.map(item =>
                typeof item !== 'string' && item.sentence ? item.sentence : '',
              )
            : undefined
        }
        shouldShowErrors={shouldShowErrors}
        edit={values => form.setFieldValue('learningOutcomes', values)}
      />
    ) : null

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
    description,
    learningOutcomes,
    resourceFooter,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const snackbars = (
    <SnackbarStack
      snackbarList={[
        showUrlCopiedAlert ? (
          <Snackbar
            type="success"
            position="bottom"
            autoHideDuration={3000}
            showCloseButton={false}
            key="url-copy-snackbar"
          >
            Copied to clipoard
          </Snackbar>
        ) : null,
        showSaveError ? (
          <Snackbar
            position="bottom"
            type="error"
            autoHideDuration={3000}
            showCloseButton={false}
            onClose={() => setShowSaveError(false)}
          >
            Failed, fix the errors and try again
          </Snackbar>
        ) : null,
      ]}
    />
  )

  const modals = [
    isToDelete && deleteResource && (
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
    ),
  ]

  return (
    <>
      {modals}
      {snackbars}
      <Card className="main-resource-card" key="main-resource-card" hideBorderWhenSmall={true}>
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    </>
  )
}
MainResourceCard.displayName = 'MainResourceCard'
export default MainResourceCard

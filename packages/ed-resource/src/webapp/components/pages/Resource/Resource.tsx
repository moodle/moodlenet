import type { AddonItem } from '@moodlenet/component-library'
import {
  Card,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  SnackbarStack,
  sortAddonItems,
} from '@moodlenet/component-library'
import type { AssetInfoForm } from '@moodlenet/component-library/common'
import { DateField, DropdownField, LicenseField } from '@moodlenet/ed-meta/ui'
import type { MainLayoutProps } from '@moodlenet/react-app/ui'
import { MainLayout, useViewport } from '@moodlenet/react-app/ui'
import { InsertDriveFile, Link } from '@mui/icons-material'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SaveState } from '../../../../common/types.mjs'
import {
  type EdMetaOptionsProps,
  type ResourceAccessProps,
  type ResourceActions,
  type ResourceDataProps,
  type ResourceFormProps,
  type ResourceStateProps,
} from '../../../../common/types.mjs'
import type { ValidationSchemas } from '../../../../common/validationSchema.mjs'
import {
  ResourceContributorCard,
  type ResourceContributorCardProps,
} from '../../molecules/ResourceContributorCard/ResourceContributorCard.js'
import type {
  MainResourceCardSlots,
  ValidForms,
} from '../../organisms/MainResourceCard/MainResourceCard.js'
import { MainResourceCard } from '../../organisms/MainResourceCard/MainResourceCard.js'
import './Resource.scss'

export type ResourceProps = {
  saveState: SaveState
  mainLayoutProps: MainLayoutProps
  mainResourceCardSlots: MainResourceCardSlots
  resourceContributorCardProps: ResourceContributorCardProps

  wideColumnItems: AddonItem[]
  mainColumnItems: AddonItem[]
  rightColumnItems: AddonItem[]

  extraDetailsItems: AddonItem[]
  generalActionsItems: AddonItem[]

  resourceForm: ResourceFormProps
  data: ResourceDataProps
  state: ResourceStateProps
  actions: ResourceActions
  access: ResourceAccessProps
  edMetaOptions: EdMetaOptionsProps

  fileMaxSize: number
  validationSchemas: ValidationSchemas
}

export const Resource: FC<ResourceProps> = ({
  mainLayoutProps,
  resourceContributorCardProps,

  wideColumnItems,
  mainColumnItems,
  rightColumnItems,

  extraDetailsItems,
  generalActionsItems,
  mainResourceCardSlots,

  data,
  resourceForm,
  edMetaOptions,

  state,
  actions,
  access,
  saveState,

  fileMaxSize,
  validationSchemas: {
    draftContentValidationSchema,
    publishedContentValidationSchema,
    draftResourceValidationSchema,
    imageValidationSchema,
    publishedResourceValidationSchema,
  },
}) => {
  const viewport = useViewport()
  const { downloadFilename, contentUrl, contentType, image, id } = data
  const {
    editData,
    deleteResource,
    publish,
    unpublish: setUnpublish,
    setContent,
    setImage,
  } = actions
  const { canPublish, canEdit } = access
  const { isPublished, uploadProgress, autofillProgress, isAutofilled } = state
  const { image: isSavingImage } = saveState
  const {
    languageOptions,
    levelOptions,
    licenseOptions,
    monthOptions,
    subjectOptions,
    typeOptions,
    yearOptions,
    learningOutcomeOptions,
  } = edMetaOptions

  const [emptyOnStart, setEmptyOnStart] = useState<boolean>(
    !resourceForm.title &&
      !resourceForm.description &&
      !image &&
      !contentUrl &&
      !resourceForm.type &&
      !resourceForm.language &&
      !resourceForm.license &&
      !resourceForm.level &&
      !resourceForm.subject &&
      !resourceForm.year &&
      !resourceForm.month &&
      !(resourceForm.learningOutcomes.length > 0),
  )

  const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  const [isPublishValidating, setIsPublishValidating] = useState<boolean>(isPublished)
  const [showCheckPublishSuccess, setShowCheckPublishSuccess] = useState<
    'success' | 'failed' | 'idle'
  >('idle')
  const [showPublishSuccess, setShowPublishSuccess] = useState<'success' | 'failed' | 'idle'>(
    'idle',
  )
  const [showUnpublishSuccess, setShowUnpublishSuccess] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(emptyOnStart)

  const prevIsPublishedRef = useRef(isPublished)

  useEffect(() => {
    if (prevIsPublishedRef.current === false && isPublished === true) {
      setShowPublishSuccess('success')
    }
    if (prevIsPublishedRef.current === true && isPublished === false) {
      setShowUnpublishSuccess(true)
    }
    prevIsPublishedRef.current = isPublished
  }, [isPublished])

  const form = useFormik<ResourceFormProps>({
    initialValues: resourceForm,
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema: isPublishValidating
      ? publishedResourceValidationSchema
      : draftResourceValidationSchema,
    onSubmit: editData,
  })
  const isPublishedFormValid = publishedResourceValidationSchema.isValidSync(form.values)
  const isDraftFormValid = draftResourceValidationSchema.isValidSync(form.values)

  const contentForm = useFormik<{ content: File | string | undefined | null }>({
    initialValues: useMemo(() => ({ content: contentUrl }), [contentUrl]),
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema: isPublishValidating
      ? publishedContentValidationSchema
      : draftContentValidationSchema,
    onSubmit: values => {
      return setContent(values.content)
    },
  })
  const isPublishedContentValid = publishedContentValidationSchema.isValidSync(contentForm.values)
  const isDraftContentValid = draftContentValidationSchema.isValidSync(contentForm.values)

  const imageForm = useFormik<{ image: AssetInfoForm | undefined | null }>({
    initialValues: useMemo(() => ({ image: image }), [image]),
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema: imageValidationSchema,
    onSubmit: values => {
      return values.image?.location !== image?.location &&
        typeof values.image?.location !== 'string'
        ? setImage(values.image?.location)
        : undefined
    },
  })
  const isImageValid = imageValidationSchema.isValidSync(imageForm.values)

  const contentForm_setTouched = contentForm.setTouched
  const imageForm_setTouched = imageForm.setTouched
  const form_setTouched = form.setTouched

  const setFieldsAsTouched = useCallback(() => {
    form_setTouched({
      title: true,
      description: true,
      type: true,
      language: true,
      license: true,
      level: true,
      subject: true,
      year: true,
      month: true,
    })
    contentForm_setTouched({ content: true })
    imageForm_setTouched({ image: true })
  }, [contentForm_setTouched, form_setTouched, imageForm_setTouched])

  const contributorCard = isPublished && (
    <ResourceContributorCard {...resourceContributorCardProps} key="contributor-card" />
  )

  const imageForm_validateForm = imageForm.validateForm
  const imageForm_setFieldValue = imageForm.setFieldValue
  const form_validateForm = form.validateForm
  const contentForm_validateForm = contentForm.validateForm

  const setImageField = useCallback(
    (image: AssetInfoForm | undefined | null) => {
      imageForm_setFieldValue('image', image).then(() => {
        imageForm_validateForm()
        imageForm_setTouched({ image: true })
      })
    },
    [imageForm_setFieldValue, imageForm_setTouched, imageForm_validateForm],
  )

  const [isCheckingAndPublishing, setIsCheckingAndPublishing] = useState<boolean>(false)

  const checkFormsAndPublish = () => {
    setIsPublishValidating(true)
    setIsCheckingAndPublishing(true)
  }

  const applyCheckFormsAndPublish = useCallback(() => {
    setFieldsAsTouched()

    if (isPublishedFormValid && isPublishedContentValid) {
      form_validateForm()
      contentForm_validateForm()
      setShouldShowErrors(false)
      publish()
    } else {
      setIsEditing(true)
      setShowPublishSuccess('failed')
      setShouldShowErrors(true)
    }
  }, [
    contentForm_validateForm,
    form_validateForm,
    isPublishedContentValid,
    isPublishedFormValid,
    publish,
    setFieldsAsTouched,
  ])

  useEffect(() => {
    if (isCheckingAndPublishing) {
      applyCheckFormsAndPublish()
      setIsCheckingAndPublishing(false)
    }
  }, [
    isCheckingAndPublishing,
    applyCheckFormsAndPublish,
    isImageValid,
    imageForm_setFieldValue,
    imageForm_validateForm,
  ])

  const [isPublishChecking, setIsPublishChecking] = useState<boolean>(false)

  const publishCheck = () => {
    setIsPublishValidating(true)
    setIsPublishChecking(true)
    !isImageValid && setImageField(null)
  }

  const applyPublishCheck = useCallback(() => {
    setFieldsAsTouched()

    if (isPublishedFormValid && isPublishedContentValid) {
      setShowCheckPublishSuccess('success')
      setShouldShowErrors(false)
    } else {
      form_validateForm()
      contentForm_validateForm()
      setShowCheckPublishSuccess('failed')
      setShouldShowErrors(true)
    }
  }, [
    contentForm_validateForm,
    form_validateForm,
    isPublishedContentValid,
    isPublishedFormValid,
    setFieldsAsTouched,
  ])

  useEffect(() => {
    if (isPublishChecking) {
      applyPublishCheck()
      setIsPublishChecking(false)
    }
  }, [
    isPublishChecking,
    applyPublishCheck,
    isImageValid,
    imageForm_validateForm,
    imageForm_setFieldValue,
  ])

  const unpublish = () => {
    setIsPublishValidating(false)
    setShouldShowErrors(false)
    setUnpublish()
  }

  const areFormsValid: ValidForms = {
    isDraftFormValid: isDraftFormValid,
    isPublishedFormValid: isPublishedFormValid,
    isDraftContentValid: isDraftContentValid,
    isPublishedContentValid: isPublishedContentValid,
    isImageValid: isImageValid,
  }

  const mainResourceCard = (
    <MainResourceCard
      key="main-resource-card"
      learningOutcomeOptions={learningOutcomeOptions}
      publish={checkFormsAndPublish}
      unpublish={unpublish}
      publishCheck={publishCheck}
      data={data}
      edMetaOptions={edMetaOptions}
      form={form}
      contentForm={contentForm}
      imageForm={imageForm}
      state={state}
      actions={actions}
      access={access}
      slots={mainResourceCardSlots}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      setIsPublishValidating={setIsPublishValidating}
      emptyOnStart={emptyOnStart}
      setEmptyOnStart={setEmptyOnStart}
      areFormsValid={areFormsValid}
      setShouldShowErrors={setShouldShowErrors}
      shouldShowErrors={shouldShowErrors}
      setFieldsAsTouched={setFieldsAsTouched}
      fileMaxSize={fileMaxSize}
    />
  )

  const publishButton: AddonItem | null =
    !isEditing && canPublish && !isPublished
      ? {
          Item: () => (
            <PrimaryButton onClick={checkFormsAndPublish} color="green" key="publish-button">
              Publish
            </PrimaryButton>
          ),
          key: 'publish-button',
          position: 0,
        }
      : null

  const publishCheckButton = isEditing && canPublish && !isPublished && (
    <PrimaryButton onClick={publishCheck} color="green">
      Publish check
    </PrimaryButton>
  )

  const unpublishButton: AddonItem | null =
    canPublish && isPublished
      ? {
          Item: () => (
            <SecondaryButton onClick={unpublish} key="unpublish-button">
              Unpublish
            </SecondaryButton>
          ),
          key: 'unpublish-button',
          position: 0,
        }
      : null

  const disableExtraDetails =
    !id ||
    !contentForm.values.content ||
    uploadProgress !== undefined ||
    autofillProgress !== undefined

  const subjectField = (isEditing || canEdit) && (
    <DropdownField
      key="subject-field"
      disabled={disableExtraDetails}
      title="Subject"
      placeholder="Content category"
      canEdit={canEdit && isEditing}
      selection={form.values.subject}
      options={subjectOptions}
      error={form.errors.subject}
      edit={e => form.setFieldValue('subject', e)}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const licenseField = (
    <LicenseField
      key="license-field"
      disabled={disableExtraDetails}
      canEdit={canEdit && isEditing}
      license={form.values.license}
      licenseOptions={licenseOptions}
      editLicense={e => {
        form.setFieldValue('license', e)
      }}
      error={form.errors.license}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const typeField = (
    <DropdownField
      key="type-field"
      disabled={disableExtraDetails}
      title="Type"
      placeholder="Content type"
      canEdit={canEdit && isEditing}
      selection={form.values.type}
      options={typeOptions}
      edit={e => {
        form.setFieldValue('type', e)
      }}
      error={form.errors.type}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const levelField = (
    <DropdownField
      key="level-field"
      disabled={disableExtraDetails}
      title="Level"
      placeholder="Education level"
      canEdit={canEdit && isEditing}
      selection={form.values.level}
      options={levelOptions}
      edit={e => {
        form.setFieldValue('level', e)
      }}
      error={form.errors.level}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const dateField = (
    <DateField
      key="date-field"
      disabled={disableExtraDetails}
      canEdit={canEdit && isEditing}
      month={form.values.month}
      monthOptions={monthOptions}
      year={form.values.year}
      yearOptions={yearOptions}
      editMonth={e => {
        form.setFieldValue('month', e)
      }}
      editYear={e => {
        form.setFieldValue('year', e)
      }}
      errorMonth={form.errors.month}
      errorYear={form.errors.year}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const languageField = (
    <DropdownField
      key="language-field"
      disabled={disableExtraDetails}
      title="Language"
      placeholder="Content language"
      canEdit={canEdit && isEditing}
      selection={form.values.language}
      options={languageOptions}
      edit={e => {
        form.setFieldValue('language', e)
      }}
      error={form.errors.language}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const updatedExtraDetailsItems = [
    subjectField,
    licenseField,
    typeField,
    levelField,
    dateField,
    languageField,
    ...(extraDetailsItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const shouldShowExtraDetails =
    (isEditing && updatedExtraDetailsItems.length > 0) ||
    (!isEditing &&
      (form.values.subject ||
        form.values.license ||
        form.values.type ||
        form.values.level ||
        form.values.month ||
        form.values.year ||
        form.values.language ||
        (extraDetailsItems && extraDetailsItems.length > 0)))

  const extraDetailsContainer = shouldShowExtraDetails ? (
    <Card className="extra-details-card" hideBorderWhenSmall={true} key="extra-details-container">
      {updatedExtraDetailsItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </Card>
  ) : null

  const downloadButton =
    contentType === 'file' && contentUrl && contentForm.values.content ? (
      <a
        href={contentUrl ?? undefined}
        target="_blank"
        rel="noreferrer"
        download={downloadFilename}
      >
        <SecondaryButton key="download-or-open-link-button">
          <InsertDriveFile />
          Download file
        </SecondaryButton>
      </a>
    ) : null

  const openLinkButton =
    contentType === 'link' && contentUrl && contentForm.values.content ? (
      <a href={contentUrl ?? undefined} target="_blank" rel="noreferrer">
        <SecondaryButton key="download-or-open-link-button">
          <Link />
          Open link
        </SecondaryButton>
      </a>
    ) : null

  const updatedGeneralActionsItems = sortAddonItems([
    publishButton,
    publishCheckButton,
    unpublishButton,
    ...(generalActionsItems ?? []),
    downloadButton,
    openLinkButton,
  ])

  const generalActionsContainer = (
    <Card className="resource-action-card" hideBorderWhenSmall={true} key="resource-action-card">
      {updatedGeneralActionsItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </Card>
  )

  const updatedWideColumnItems = [
    !viewport.screen.big && mainResourceCard,
    ...(wideColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const updatedMainColumnItems = [
    viewport.screen.big && mainResourceCard,
    !viewport.screen.big && contributorCard,
    !viewport.screen.big && generalActionsContainer,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const updatedRightColumnItems = [
    viewport.screen.big && contributorCard,
    viewport.screen.big && generalActionsContainer,
    extraDetailsContainer,
    ...(rightColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const uploadSnackbar =
    uploadProgress !== undefined || isSavingImage === 'saving' ? (
      <Snackbar
        position="bottom"
        type="info"
        waitDuration={4000}
        showCloseButton={false}
        autoHideDuration={6000}
      >
        {`Uploading file, feel free to move around the platform, just don't close the tab`}
      </Snackbar>
    ) : null

  const [showAutofillSuccess, setShowAutofillSuccess] = useState<boolean>(false)
  const prevIsAutofilledRef = useRef<boolean>(isAutofilled)

  useEffect(() => {
    // Check if the value changed from false to true
    if (!prevIsAutofilledRef.current && isAutofilled) {
      setShowAutofillSuccess(true)
    }
    prevIsAutofilledRef.current = isAutofilled
  }, [isAutofilled, prevIsAutofilledRef])

  const autofillSuccessSnackbar = showAutofillSuccess ? (
    <Snackbar
      position="bottom"
      type="success"
      showCloseButton={false}
      autoHideDuration={6000}
      onClose={() => setShowAutofillSuccess(false)}
    >
      {`Resource ready! Verify and edit any required details`}
    </Snackbar>
  ) : null

  console.log('isAutofilled', isAutofilled)

  const checkPublishSnackbar =
    showCheckPublishSuccess !== 'idle' ? (
      <Snackbar
        position="bottom"
        type={showCheckPublishSuccess === 'success' ? 'success' : 'error'}
        autoHideDuration={3000}
        showCloseButton={false}
        onClose={() => setShowCheckPublishSuccess('idle')}
      >
        {showCheckPublishSuccess === 'success'
          ? `Success, save before publishing`
          : `Failed, fix the errors and try again`}
      </Snackbar>
    ) : null

  const publishSnackbar =
    showPublishSuccess !== 'idle' ? (
      <Snackbar
        position="bottom"
        type={showPublishSuccess === 'success' ? 'success' : 'error'}
        autoHideDuration={3000}
        showCloseButton={false}
        onClose={() => setShowPublishSuccess('idle')}
      >
        {showPublishSuccess === 'success'
          ? `Resource published`
          : `Failed, fix the errors and try again`}
      </Snackbar>
    ) : null

  const unpublishSnackbar = showUnpublishSuccess ? (
    <Snackbar
      position="bottom"
      type="success"
      autoHideDuration={3000}
      showCloseButton={false}
      onClose={() => setShowUnpublishSuccess(false)}
    >
      {`Resource unpublished`}
    </Snackbar>
  ) : null

  const snackbars = (
    <SnackbarStack
      snackbarList={[
        uploadSnackbar,
        autofillSuccessSnackbar,
        checkPublishSnackbar,
        publishSnackbar,
        unpublishSnackbar,
      ]}
    />
  )

  const modals = (
    <>
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
      <div className="resource">
        <div className="content">
          {updatedWideColumnItems.length > 0 && (
            <div className="wide-column">
              {updatedWideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
            </div>
          )}
          {(updatedMainColumnItems.length > 0 || updatedRightColumnItems.length > 0) && (
            <div className="main-and-right-columns">
              {updatedMainColumnItems.length > 0 && (
                <div className="main-column">
                  {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
                </div>
              )}
              {updatedRightColumnItems.length > 0 && (
                <div className="right-column">
                  {updatedRightColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
Resource.displayName = 'ResourcePage'
export default Resource

import { unreachable_never } from '@moodle/lib-types'
import { Card } from '../../atoms/Card/Card'
import { PrimaryButton } from '../../atoms/PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../../atoms/SecondaryButton/SecondaryButton'
import MainResourceCard from './MainResourceCard/MainResourceCard'
import './Resource.scss'
import { ResourceContributorCard } from './ResourceContributorCard/ResourceContributorCard'

export type ResourceProps = {}

export function ResourcePage({}: ResourceProps) {
  const viewport = useViewport()
  const { downloadFilename, contentUrl, contentType, image } = data
  const {
    editData,
    deleteResource,
    publish,
    unpublish: setUnpublish,
    provideContent: setContent,
    setImage,
    startAutofill,
  } = actions
  const { canPublish, canEdit } = access
  const { isPublished, uploadProgress, autofillState } = state
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
  const [showCheckPublishSuccess, setShowCheckPublishSuccess] = useState<'success' | 'failed' | 'idle'>('idle')
  const [showPublishSuccess, setShowPublishSuccess] = useState<'success' | 'failed' | 'idle'>('idle')
  const [showUnpublishSuccess, setShowUnpublishSuccess] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(
    emptyOnStart || (!!uploadProgress && uploadProgress !== 'N/A' && uploadProgress >= 0) || autofillState !== undefined, // || !(autofillState === undefined || autofillState === 'ai-saved-generated-data'),
  )

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
    validationSchema: isPublishValidating ? publishedResourceValidationSchema : draftResourceValidationSchema,
    onSubmit(meta) {
      return editData(meta)
    },
  })

  const isPublishedFormValid = publishedResourceValidationSchema.isValidSync(form.values)
  const isDraftFormValid = draftResourceValidationSchema.isValidSync(form.values)

  const form_setValues = form.setValues
  const prevResourceFormRef = useRef(resourceForm)
  useEffect(() => {
    if (prevResourceFormRef.current !== resourceForm) {
      form_setValues(resourceForm)
    }
    prevResourceFormRef.current = resourceForm
  }, [form_setValues, resourceForm])

  const contentForm = useFormik<{ content: File | string }>({
    initialValues: useMemo(() => ({ content: contentUrl ?? '' }), [contentUrl]),
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema: contentValidationSchema,
    onSubmit: values => {
      return setContent(values.content)
    },
  })
  const isContentValid = contentValidationSchema.isValidSync(contentForm.values)

  const imageForm = useFormik<{ image: AssetInfoForm | undefined | null }>({
    initialValues: useMemo(() => ({ image: image }), [image]),
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema: imageValidationSchema,
    onSubmit: values => {
      return values.image?.location !== image?.location && typeof values.image?.location !== 'string'
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

  useEffect(() => {
    if (autofillState === 'ai-completed') {
      setFieldsAsTouched()
    }
  }, [autofillState, setFieldsAsTouched])

  const hasAllData =
    typeof form.values.title === 'string' &&
    form.values.title !== '' &&
    typeof form.values.description === 'string' &&
    form.values.description !== '' &&
    // !image &&
    typeof contentUrl === 'string' &&
    typeof form.values.type === 'string' &&
    typeof form.values.language === 'string' &&
    typeof form.values.license === 'string' &&
    typeof form.values.level === 'string' &&
    typeof form.values.subject === 'string' &&
    typeof form.values.year === 'string' &&
    typeof form.values.month === 'string' &&
    form.values.learningOutcomes.length > 0

  const disableFields =
    !contentForm.values.content ||
    uploadProgress !== undefined ||
    (autofillState !== undefined && autofillState !== 'ai-completed')

  const contributorCard = !isCreating && <ResourceContributorCard {...resourceContributorCardProps} key="contributor-card" />

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

    if (isPublishedFormValid && isContentValid) {
      form_validateForm()
      contentForm_validateForm()
      setShouldShowErrors(false)
      publish()
    } else {
      setIsEditing(true)
      setShowPublishSuccess('failed')
      setShouldShowErrors(true)
    }
  }, [contentForm_validateForm, form_validateForm, isContentValid, isPublishedFormValid, publish, setFieldsAsTouched])

  useEffect(() => {
    if (isCheckingAndPublishing) {
      applyCheckFormsAndPublish()
      setIsCheckingAndPublishing(false)
    }
  }, [isCheckingAndPublishing, applyCheckFormsAndPublish, isImageValid, imageForm_setFieldValue, imageForm_validateForm])

  const [isPublishChecking, setIsPublishChecking] = useState<boolean>(false)

  const publishCheck = () => {
    setIsPublishValidating(true)
    setIsPublishChecking(true)
    !isImageValid && setImageField(null)
  }

  const applyPublishCheck = useCallback(() => {
    setFieldsAsTouched()

    if (isPublishedFormValid && isContentValid) {
      setShowCheckPublishSuccess('success')
      setShouldShowErrors(false)
    } else {
      form_validateForm()
      contentForm_validateForm()
      setShowCheckPublishSuccess('failed')
      setShouldShowErrors(true)
    }
  }, [contentForm_validateForm, form_validateForm, isContentValid, isPublishedFormValid, setFieldsAsTouched])

  useEffect(() => {
    if (isPublishChecking) {
      applyPublishCheck()
      setIsPublishChecking(false)
    }
  }, [isPublishChecking, applyPublishCheck, isImageValid, imageForm_validateForm, imageForm_setFieldValue])

  const unpublish = () => {
    setIsPublishValidating(false)
    setShouldShowErrors(false)
    setUnpublish()
  }

  const areFormsValid: ValidForms = {
    isDraftFormValid: isDraftFormValid,
    isPublishedFormValid: isPublishedFormValid,
    isContentValid: isContentValid,
    isImageValid: isImageValid,
  }

  const mainResourceCard = <MainResourceCard {...props} />

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

  const autofillButton: AddonItem | null =
    isEditing && !hasAllData && !disableFields
      ? {
          Item: () => (
            <PrimaryButton onClick={startAutofill} color="green">
              Autofill missing fields
            </PrimaryButton>
          ),
          key: 'autofill-button',
          position: 0,
        }
      : null

  const publishCheckButton: AddonItem | null =
    isEditing && /* canPublish && */ !isPublished && (hasAllData || disableFields)
      ? {
          Item: () => (
            <PrimaryButton onClick={publishCheck} color="green" disabled={disableFields}>
              Publish check
            </PrimaryButton>
          ),
          key: 'publish-check-button',
          position: 0,
        }
      : null

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

  const { addSnackbar } = useSnackbar()

  const showUploadingSnackbar = uploadProgress !== undefined || isSavingImage === 'saving'

  return (
    <div className="resource-page">
      <div className="main-card">
        <MainResourceCard {...{ resourcePageProps }} />
      </div>
      {activity === 'viewPublished' && (
        <div className="contributor-card">
          <ResourceContributorCard {...contributorCardProps} key="contributor-card" />
        </div>
      )}
      <div className="actions">
        <Card hideBorderWhenSmall={true}>
          {actions.unpublish && <SecondaryButton onClick={() => actions.unpublish?.()}>Unpublish</SecondaryButton>}
          {activity === 'editDraft' && (
            <PrimaryButton onClick={() => alert('publishCheck')} color="green">
              Publish check
            </PrimaryButton>
          )}
          {actions.publish && (
            <PrimaryButton onClick={actions.publish} color="green">
              Publish
            </PrimaryButton>
          )}
          {activity === 'editDraft' && (
            <PrimaryButton onClick={startAutofill} color="green">
              Autofill missing fields
            </PrimaryButton>
          )}
          {activity === 'viewPublished' ? (
            type === 'link' ? (
              <a href={contentUrl && !disableFields ? contentUrl : undefined} target="_blank" rel="noreferrer">
                <SecondaryButton key="download-or-open-link-button" disabled={disableFields}>
                  <Link />
                  Open link
                </SecondaryButton>
              </a>
            ) : type === 'local' ? (
              <a
                href={contentUrl && !disableFields ? contentUrl : undefined}
                target="_blank"
                rel="noreferrer"
                download={downloadFilename}
              >
                <SecondaryButton key="download-or-open-link-button" disabled={disableFields}>
                  <InsertDriveFile />
                  Download file
                </SecondaryButton>
              </a>
            ) : (
              unreachable_never(type)
            )
          ) : null}
        </Card>
      </div>
      <div className="details">
        <DropdownField
          key="subject-field"
          disabled={disableFields}
          title="Subject"
          placeholder="Content category"
          canEdit={activity === 'editDraft'}
          selection={form.values.subject}
          options={subjectOptions}
          error={form.errors.subject}
          edit={e => form.setFieldValue('subject', e)}
          shouldShowErrors={shouldShowErrors}
        />

        <LicenseField
          key="license-field"
          disabled={disableFields}
          canEdit={activity === 'editDraft'}
          license={form.values.license}
          licenseOptions={licenseOptions}
          editLicense={e => {
            form.setFieldValue('license', e)
          }}
          error={form.errors.license}
          shouldShowErrors={shouldShowErrors}
        />

        <DropdownField
          key="type-field"
          disabled={disableFields}
          title="Type"
          placeholder="Content type"
          canEdit={activity === 'editDraft'}
          selection={form.values.type}
          options={typeOptions}
          edit={e => {
            form.setFieldValue('type', e)
          }}
          error={form.errors.type}
          shouldShowErrors={shouldShowErrors}
        />

        <DropdownField
          key="level-field"
          disabled={disableFields}
          title="Level"
          placeholder="Education level"
          canEdit={activity === 'editDraft'}
          selection={form.values.level}
          options={levelOptions}
          edit={e => {
            form.setFieldValue('level', e)
          }}
          error={form.errors.level}
          shouldShowErrors={shouldShowErrors}
        />

        <DateField
          key="date-field"
          disabled={disableFields}
          canEdit={activity === 'editDraft'}
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

        <DropdownField
          key="language-field"
          disabled={disableFields}
          title="Language"
          placeholder="Content language"
          canEdit={activity === 'editDraft'}
          selection={form.values.language}
          options={languageOptions}
          edit={e => {
            form.setFieldValue('language', e)
          }}
          error={form.errors.language}
          shouldShowErrors={shouldShowErrors}
        />
      </div>
    </div>
  )
}
/*

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (showUploadingSnackbar) {
      timeoutId = setTimeout(() => {
        addSnackbar({
          position: 'bottom',
          autoHideDuration: 6000,
          children: "Uploading file, feel free to move around the platform, just don't close this tab",
        })
      }, 4000)
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [showUploadingSnackbar, addSnackbar])

  useEffect(() => {
    if (autofillState === 'ai-generation') {
      addSnackbar({
        autoHideDuration: 6000,
        children: `Using AI to autofill the resource details, it usually takes a couple of minutes`,
      })
    } else if (autofillState === 'ai-completed') {
      addSnackbar({
        autoHideDuration: 6000,
        type: 'success',
        children: `Resource ready! Verify and edit any required details`,
      })
    } else if (autofillState === 'ai-error') {
      addSnackbar({
        autoHideDuration: 6000,
        children: `Unfortunatelly we couldn't complete AI autofill`,
      })
    }
  }, [addSnackbar, autofillState])

  useEffect(() => {
    if (showCheckPublishSuccess !== 'idle') {
      addSnackbar({
        autoHideDuration: 4000,
        type: showCheckPublishSuccess === 'success' ? 'success' : 'error',
        children:
          showCheckPublishSuccess === 'success' ? `Success, save before publishing` : `Failed, fix the errors and try again`,
        onClose: () => setShowCheckPublishSuccess('idle'),
      })
    }
  }, [addSnackbar, showCheckPublishSuccess])

  useEffect(() => {
    if (showPublishSuccess !== 'idle') {
      addSnackbar({
        type: showPublishSuccess === 'success' ? 'success' : 'error',
        autoHideDuration: 4000,
        children: showPublishSuccess === 'success' ? `Resource published` : `Failed, fix the errors and try again`,
        onClose: () => setShowPublishSuccess('idle'),
      })
    }
  }, [addSnackbar, showPublishSuccess])

  useEffect(() => {
    if (showUnpublishSuccess) {
      addSnackbar({
        type: 'success',
        autoHideDuration: 4000,
        children: 'Resource unpublished',
        onClose: () => setShowUnpublishSuccess(false),
      })
    }
  }, [addSnackbar, showUnpublishSuccess])

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

  */

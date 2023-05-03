import { InsertDriveFile, Link } from '@material-ui/icons'
import {
  AddonItem,
  Card,
  Modal,
  PrimaryButton,
  SecondaryButton,
} from '@moodlenet/component-library'
import {
  DateField,
  LanguageField,
  LevelField,
  LicenseField,
  SubjectField,
  TypeField,
} from '@moodlenet/ed-meta/ui'
import { MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC, useEffect, useState } from 'react'
import {
  ResourceAccessProps,
  ResourceActions,
  ResourceDataProps,
  ResourceFormProps,
  ResourceStateProps,
} from '../../../../common/types.mjs'
import {
  contentValidationSchema,
  imageValidationSchema,
  resourceValidationSchema,
} from '../../../../common/validationSchema.mjs'
import {
  ResourceContributorCard,
  ResourceContributorCardProps,
} from '../../molecules/ResourceContributorCard/ResourceContributorCard.js'
import {
  MainResourceCard,
  MainResourceCardSlots,
} from '../../organisms/MainResourceCard/MainResourceCard.js'
import './Resource.scss'

export type ResourceProps = {
  mainLayoutProps: MainLayoutProps
  mainResourceCardSlots: MainResourceCardSlots
  resourceContributorCardProps: ResourceContributorCardProps

  mainColumnItems: AddonItem[]
  sideColumnItems: AddonItem[]
  extraDetailsItems: AddonItem[]
  generalActionsItems: AddonItem[]

  resourceForm: ResourceFormProps
  data: ResourceDataProps
  state: ResourceStateProps
  actions: ResourceActions
  access: ResourceAccessProps

  fileMaxSize: number
  isSaving: boolean
}

export const Resource: FC<ResourceProps> = ({
  mainLayoutProps,
  resourceContributorCardProps,

  mainColumnItems,
  sideColumnItems,
  extraDetailsItems,
  generalActionsItems,
  mainResourceCardSlots,

  data,
  resourceForm,

  state,
  actions,
  access,

  fileMaxSize,
  isSaving,
}) => {
  const { isWaitingForApproval, downloadFilename, contentUrl, contentType, imageUrl } = data
  const { editData, deleteResource, publish, unpublish, setContent, setImage } = actions
  const { canPublish, canEdit } = access
  const { isPublished } = state

  const form = useFormik<ResourceFormProps>({
    initialValues: resourceForm,
    validationSchema: resourceValidationSchema,
    onSubmit: values => {
      return editData(values)
    },
  })

  const contentForm = useFormik<{ content: File | string | undefined | null }>({
    initialValues: { content: contentUrl },
    validationSchema: contentValidationSchema,
    // validateOnMount: true,
    // validateOnChange: true,
    onSubmit: values => {
      return setContent(values.content)
    },
  })

  const imageForm = useFormik<{ image: File | string | undefined | null }>({
    initialValues: { image: imageUrl },
    validationSchema: imageValidationSchema,
    onSubmit: values => {
      return typeof values.image !== 'string' ? setImage(values.image) : undefined
    },
  })

  useEffect(() => {
    if (form.dirty) {
      editData(form.values)
    }
  }, [form.values, form.dirty, editData])

  //   const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
  //     useState<boolean>(false)
  //   const [isAddingToMoodleLms, setIsAddingToMoodleLms] =
  //     useState<boolean>(false)
  const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  // const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
  // const backupImage: AssetInfo | null | undefined = useMemo(
  //   () => getBackupImage(resourceId),
  //   [resourceId],
  // )
  //   const [isReporting, setIsReporting] = useState<boolean>(false)
  //   const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
  // const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  // const [isEditing, setIsEditing] = useReducer(_ => !_, false)

  // const [imageUrl] = useImageUrl(form.values?.image?.location, backupImage?.location)

  const contributorCard = isPublished && (
    <ResourceContributorCard {...resourceContributorCardProps} key="contributor-card" />
  )

  const checkFormAndPublish = () => {
    if (form.isValid && contentForm.isValid && imageForm.isValid) {
      form.submitForm()
      contentForm.submitForm()
      imageForm.submitForm()
      setShouldShowErrors(false)
      publish()
    } else {
      setShouldShowErrors(true)
    }
  }

  const mainResourceCard = (
    <MainResourceCard
      key="main-resource-card"
      publish={checkFormAndPublish}
      data={data}
      form={form}
      contentForm={contentForm}
      imageForm={imageForm}
      state={state}
      actions={actions}
      access={access}
      slots={mainResourceCardSlots}
      fileMaxSize={fileMaxSize}
      isSaving={isSaving}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const publishButton = canPublish && !isPublished && !isWaitingForApproval && (
    <PrimaryButton onClick={checkFormAndPublish} color="green" key="publish-button">
      Publish
    </PrimaryButton>
  )

  const unpublishButton = canPublish && (isPublished || isWaitingForApproval) && (
    <SecondaryButton onClick={unpublish} key="unpublish-button">
      Unpublish
    </SecondaryButton>
  )

  // const editorActionsContainer = canPublish ? (
  //   <Card
  //     className="resource-action-card"
  //     hideBorderWhenSmall={true}
  //     key="editor-actions-container"
  //   >
  //     {/* {isPublished && (
  //       <PrimaryButton color={'green'} style={{ pointerEvents: 'none' }}>
  //         Published
  //       </PrimaryButton>
  //     )} */}

  //     {/* {!isPublished && isWaitingForApproval && (
  //       <PrimaryButton disabled={true}>Publish requested</PrimaryButton>
  //     )} */}
  //     {/* {isPublished || isWaitingForApproval ? (
  //       <SecondaryButton onClick={unpublish}>Unpublish</SecondaryButton>
  //     ) : (
  //       <></>
  //     )} */}
  //   </Card>
  // ) : null

  const subjectField = (
    <SubjectField
      key="subject-field"
      canEdit={canEdit}
      subject={form.values.subject}
      error={form.errors.subject}
      editSubject={e => form.setFieldValue('subject', e)}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const licenseField = (
    <LicenseField
      key="license-field"
      canEdit={canEdit}
      license={form.values.license}
      editLicense={e => {
        form.setFieldValue('license', e)
      }}
      error={form.errors.license}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const typeField = (
    <TypeField
      key="type-field"
      canEdit={canEdit}
      type={form.values.type}
      editType={e => {
        form.setFieldValue('type', e)
      }}
      error={form.errors.type}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const levelField = (
    <LevelField
      key="level-field"
      canEdit={canEdit}
      level={form.values.level}
      editLevel={e => {
        form.setFieldValue('level', e)
      }}
      error={form.errors.level}
      shouldShowErrors={shouldShowErrors}
    />
  )

  const dateField = (
    <DateField
      key="date-field"
      canEdit={canEdit}
      month={form.values.month}
      year={form.values.year}
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
    <LanguageField
      key="language-field"
      canEdit={canEdit}
      language={form.values.language}
      editLanguage={e => {
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

  console.log('errors ', form.errors)

  const extraDetailsContainer =
    updatedExtraDetailsItems.length > 0 ? (
      <Card className="extra-details-card" hideBorderWhenSmall={true} key="extra-details-container">
        {updatedExtraDetailsItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    ) : null

  const downloadOrOpenLink =
    contentUrl || contentForm.values.content ? (
      <a
        href={contentUrl ?? undefined}
        target="_blank"
        rel="noreferrer"
        download={downloadFilename}
      >
        <SecondaryButton key="donwload-or-open-link-button">
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
    ) : null

  const updatedGeneralActionsItems = [
    publishButton,
    unpublishButton,
    ...(generalActionsItems ?? []),
    downloadOrOpenLink,
  ].filter((item): item is AddonItem => !!item)

  const generalActionsContainer = (
    <Card className="resource-action-card" hideBorderWhenSmall={true} key="resource-action-card">
      {/* <PrimaryButton
            // onClick={() => setIsAddingToMoodleLms(true)}
            >
              Send to Moodle
            </PrimaryButton> */}
      {/* {isAuthenticated && ( */}
      {updatedGeneralActionsItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </Card>
  )

  const updatedSideColumnItems = [
    contributorCard,
    // editorActionsContainer,
    generalActionsContainer,
    extraDetailsContainer,
    ...(sideColumnItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const updatedMainColumnItems = [mainResourceCard, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const snackbars = <></>

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
          <div className="main-column">
            {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
          </div>
          <div className="side-column">
            {updatedSideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
Resource.displayName = 'ResourcePage'
export default Resource

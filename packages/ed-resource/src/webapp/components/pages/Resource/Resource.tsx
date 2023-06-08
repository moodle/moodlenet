import { InsertDriveFile, Link } from '@material-ui/icons'
import type { AddonItem } from '@moodlenet/component-library'
import { Card, Modal, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'
import {
  DateField,
  LanguageField,
  LevelField,
  LicenseField,
  SubjectField,
  TypeField,
} from '@moodlenet/ed-meta/ui'
import type { MainLayoutProps } from '@moodlenet/react-app/ui'
import { MainLayout, useViewport } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type {
  EdMetaOptionsProps,
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
import type { ResourceContributorCardProps } from '../../molecules/ResourceContributorCard/ResourceContributorCard.js'
import { ResourceContributorCard } from '../../molecules/ResourceContributorCard/ResourceContributorCard.js'
import type { MainResourceCardSlots } from '../../organisms/MainResourceCard/MainResourceCard.js'
import { MainResourceCard } from '../../organisms/MainResourceCard/MainResourceCard.js'
import './Resource.scss'

export type ResourceProps = {
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
  isSaving: boolean
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

  fileMaxSize,
  isSaving,
}) => {
  const viewport = useViewport()
  const { downloadFilename, contentUrl, contentType, imageUrl } = data
  const { editData, deleteResource, publish, unpublish, setContent, setImage, reportResource } =
    actions
  const { canPublish, canEdit } = access
  const { isPublished } = state
  const {
    languageOptions,
    levelOptions,
    licenseOptions,
    monthOptions,
    subjectOptions,
    typeOptions,
    yearOptions,
  } = edMetaOptions

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
  //   () => getBackupImage(id),
  //   [id],
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

  const publishButton = canPublish && !isPublished && (
    <PrimaryButton onClick={checkFormAndPublish} color="green" key="publish-button">
      Publish
    </PrimaryButton>
  )

  const unpublishButton = canPublish && isPublished && (
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

  //     {/* {!isPublished && (
  //       <PrimaryButton disabled={true}>Publish requested</PrimaryButton>
  //     )} */}
  //     {/* {isPublished ? (
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
      subjectOptions={subjectOptions}
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
      licenseOptions={licenseOptions}
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
      typeOptions={typeOptions}
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
      levelOptions={levelOptions}
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
    <LanguageField
      key="language-field"
      canEdit={canEdit}
      language={form.values.language}
      languageOptions={languageOptions}
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

  // const updatedBigScreenSideColumnItems = [
  //   contributorCard,
  //   generalActionsContainer,
  //   extraDetailsContainer,
  //   ...(bigScreenSideColumnItems ?? []),
  // ].filter((item): item is AddonItem | JSX.Element => !!item)

  // const updatedBigScreenMainColumnItems = [
  //   mainResourceCard,
  //   ...(bigScreenMainColumnItems ?? []),
  // ].filter((item): item is AddonItem | JSX.Element => !!item)

  // const updatedMediumScreenWideColumnItems = [
  //   mainResourceCard,
  //   ...(mediumScreenWideColumnItems ?? []),
  // ].filter((item): item is AddonItem | JSX.Element => !!item)

  // const updatedMediumScreenLeftColumnItems = [
  //   contributorCard,
  //   generalActionsContainer,
  //   ...(mediumScreenLeftColumnItems ?? []),
  // ].filter((item): item is AddonItem | JSX.Element => !!item)

  // const updatedMediumScreenRightColumnItems = [
  //   extraDetailsContainer,
  //   ...(mediumScreenRightColumnItems ?? []),
  // ].filter((item): item is AddonItem | JSX.Element => !!item)

  // const updatedSmallScreenColumnItems = [
  //   mainResourceCard,
  //   contributorCard,
  //   generalActionsContainer,
  //   extraDetailsContainer,
  //   ...(smallScreenColumnItems ?? []),
  // ].filter((item): item is AddonItem | JSX.Element => !!item)

  const snackbars = <></>

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
      >
        The resource will be deleted
      </Modal>
    ),
  ]

  return (
    <MainLayout {...mainLayoutProps}>
      {modals}
      {snackbars}
      <div className="resource">
        <div className="content">
          <div className="wide-column">
            {updatedWideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
          </div>
          <div className="main-and-right-columns">
            <div className="main-column">
              {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
            </div>
            <div className="right-column">
              {updatedRightColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
Resource.displayName = 'ResourcePage'
export default Resource

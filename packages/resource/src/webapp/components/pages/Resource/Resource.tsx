import { InsertDriveFile, Link } from '@material-ui/icons'
import {
  AddonItem,
  Card,
  Modal,
  PrimaryButton,
  SecondaryButton,
} from '@moodlenet/component-library'
import { MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC, useState } from 'react'
import { SchemaOf } from 'yup'
import {
  ResourceAccess,
  ResourceActions,
  ResourceData,
  ResourceFormValues,
  ResourceState,
} from '../../../../common/types.mjs'
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

  mainColumnItems?: AddonItem[]
  sideColumnItems?: AddonItem[]
  extraDetailsItems?: AddonItem[]

  data: ResourceData
  resourceForm: ResourceFormValues
  validationSchema: SchemaOf<ResourceFormValues>

  state: ResourceState
  actions: ResourceActions
  access: ResourceAccess

  fileMaxSize: number
}

export const Resource: FC<ResourceProps> = ({
  mainLayoutProps,
  resourceContributorCardProps,

  mainColumnItems,
  sideColumnItems,
  extraDetailsItems,
  mainResourceCardSlots,

  data,
  resourceForm,
  validationSchema,

  state,
  actions,
  access,

  fileMaxSize,
}) => {
  const { isWaitingForApproval, downloadFilename, contentUrl, contentType } = data
  const { editData, deleteResource, publish, unpublish, setContent, setImage } = actions
  const { canPublish } = access
  const { isPublished } = state

  const form = useFormik<ResourceFormValues>({
    initialValues: resourceForm,
    validationSchema: validationSchema,
    onSubmit: values => {
      return editData(values)
    },
  })

  const contentForm = useFormik<{ content: File | string | null }>({
    initialValues: { content: null },
    onSubmit: values => {
      return values.content ? setContent(values.content) : undefined
    },
  })

  const imageForm = useFormik<{ image: File | null }>({
    initialValues: { image: null },
    onSubmit: values => {
      return values.image ? setImage(values.image) : undefined
    },
  })

  //   const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
  //     useState<boolean>(false)
  //   const [isAddingToCollection, setIsAddingToCollection] =
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
    if (form.isValid) {
      form.submitForm()
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
      shouldShowErrors={shouldShowErrors}
    />
  )

  const editorActionsContainer = canPublish ? (
    <Card
      className="resource-action-card"
      hideBorderWhenSmall={true}
      key="editor-actions-container"
    >
      {isPublished && (
        <PrimaryButton color={'green'} style={{ pointerEvents: 'none' }}>
          Published
        </PrimaryButton>
      )}
      {!isPublished && !isWaitingForApproval /*  && !isEditing */ && (
        <PrimaryButton onClick={publish} color="green">
          Publish
        </PrimaryButton>
      )}
      {!isPublished && isWaitingForApproval && (
        <PrimaryButton disabled={true}>Publish requested</PrimaryButton>
      )}
      {isPublished || isWaitingForApproval ? (
        <SecondaryButton onClick={unpublish}>Back to draft</SecondaryButton>
      ) : (
        <></>
      )}
    </Card>
  ) : null

  const generalActionsContainer = contentUrl ? (
    <Card className="resource-action-card" hideBorderWhenSmall={true} key="resource-action-card">
      {/* <PrimaryButton
          // onClick={() => setIsAddingToMoodleLms(true)}
          >
            Send to Moodle
          </PrimaryButton> */}
      {/* {isAuthenticated && ( */}
      {/* <SecondaryButton
          // onClick={() => setIsAddingToCollection(true)}
          >
            Add to Collection
          </SecondaryButton> */}
      <a href={contentUrl} target="_blank" rel="noreferrer" download={downloadFilename}>
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
  ) : null

  // const license: AddonItem | null =
  //   contentType === 'file'
  //     ? {
  //         Item: () => (
  //           <Dropdown
  //             name="license"
  //             className="license-dropdown"
  //             onChange={form.handleChange}
  //             value={form.values.license}
  //             label={`License`}
  //             edit
  //             highlight={shouldShowErrors && !!form.errors.license}
  //             disabled={form.isSubmitting}
  //             error={form.errors.license}
  //             position={{ top: 50, bottom: 25 }}
  //             pills={
  //               licenses.selected && (
  //                 <IconPill key={licenses.selected.value} icon={licenses.selected.icon} />
  //               )
  //             }
  //           >
  //             {licenses.opts.map(({ icon, label, value }) => (
  //               <IconTextOption icon={icon} label={label} value={value} key={value} />
  //             ))}
  //           </Dropdown>
  //         ),
  //         key: 'extra-details-card',
  //       }
  //     : null

  const updatedExtraDetailsItems = [
    // license,
    ...(extraDetailsItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const extraDetailsContainer =
    updatedExtraDetailsItems.length > 0 ? (
      <Card className="extra-details-card" hideBorderWhenSmall={true} key="extra-details-container">
        {updatedExtraDetailsItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    ) : null

  const updatedSideColumnItems = [
    contributorCard,
    editorActionsContainer,
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

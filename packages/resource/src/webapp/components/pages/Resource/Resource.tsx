import { InsertDriveFile, Link } from '@material-ui/icons'
import {
  AddonItem,
  Card,
  Modal,
  OptionItemProp,
  PrimaryButton,
  SecondaryButton,
} from '@moodlenet/component-library'
import {
  FormikHandle,
  MainLayout,
  MainLayoutProps,
  SelectOptionsMulti,
} from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { SchemaOf } from 'yup'
import { ResourceFormValues, ResourceType } from '../../../../common/types.mjs'
import {
  ResourceContributorCard,
  ResourceContributorCardProps,
} from '../../molecules/ResourceContributorCard/ResourceContributorCard.js'
import {
  MainResourceCard,
  MainResourceCardProps,
} from '../../organisms/MainResourceCard/MainResourceCard.js'
import './Resource.scss'

export type ResourceProps = {
  mainLayoutProps: MainLayoutProps
  mainResourceCardProps: MainResourceCardProps
  resourceContributorCardProps: ResourceContributorCardProps

  mainColumnItems?: AddonItem[]
  sideColumnItems?: AddonItem[]
  moreButtonItems?: AddonItem[]
  extraDetailsItems?: AddonItem[]

  resource: ResourceFormValues
  editResource: (values: ResourceFormValues) => Promise<unknown>
  validationSchema: SchemaOf<ResourceFormValues>

  isAuthenticated: boolean
  // isApproved: boolean
  isOwner: boolean
  isAdmin: boolean
  canEdit: boolean
  // isEditing: boolean
  // setIsEditing: Dispatch<SetStateAction<boolean>>
  autoImageAdded: boolean
  // form: FormikHandle<Omit<ResourceFormValues, 'addToCollections'>>

  deleteResource?(): unknown
  setIsPublished: Dispatch<SetStateAction<boolean>>
  isPublished: boolean
  isWaitingForApproval?: boolean
  addToCollectionsForm: FormikHandle<{ collections: string[] }>
  sendToMoodleLmsForm: FormikHandle<{ site?: string }>
  // reportForm?: FormikHandle<{ comment: string }>
  // tags: FollowTag[]
  collections: SelectOptionsMulti<OptionItemProp>
} & ResourceType

export const Resource: FC<ResourceProps> = ({
  mainLayoutProps,
  mainResourceCardProps,
  resourceContributorCardProps,

  mainColumnItems,
  sideColumnItems,
  extraDetailsItems,
  // moreButtonItems,

  resource,
  validationSchema,
  editResource,
  deleteResource,
  setIsPublished,

  // id: resourceId,
  // url: resourceUrl,
  // contentType,
  // licenses,
  // type,
  // resourceFormat,
  // contentUrl,
  // tags,

  isAuthenticated,
  canEdit,
  // isAdmin,
  isOwner,
  isWaitingForApproval,
  isPublished,
  contentUrl,
  downloadFilename,
  // autoImageAdded,
}) => {
  const form = useFormik<ResourceFormValues>({
    initialValues: resource,
    validationSchema: validationSchema,
    onSubmit: values => {
      return editResource(values)
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

  const contributorCard = !isOwner ? (
    <ResourceContributorCard {...resourceContributorCardProps} key="contributor-card" />
  ) : null

  const publish = () => {
    if (form.isValid) {
      form.submitForm()
      setShouldShowErrors(false)
      setIsPublished(true)
    } else {
      setShouldShowErrors(true)
    }
  }
  const mainResourceCard = (
    <MainResourceCard
      {...mainResourceCardProps}
      isOwner={isOwner}
      isPublished={isPublished}
      setIsPublished={setIsPublished}
      isWaitingForApproval={isWaitingForApproval}
      isAuthenticated={isAuthenticated}
      // isEditing={isEditing}
      // setIsEditing={setIsEditing}
      canEdit={canEdit}
      form={form}
      shouldShowErrors={shouldShowErrors}
      publish={publish}
    />
  )

  const editorActionsContainer = {
    Item: () =>
      canEdit ? (
        <Card className="resource-action-card" hideBorderWhenSmall={true}>
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
            <SecondaryButton onClick={() => setIsPublished(false)}>Back to draft</SecondaryButton>
          ) : (
            <></>
          )}
        </Card>
      ) : (
        <></>
      ),
    key: 'editor-actions-container',
  }
  const generalActionsContainer = {
    Item: () =>
      form.values.content ? (
        <Card className="resource-action-card" hideBorderWhenSmall={true}>
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
            <SecondaryButton
              abbr={form.values.content instanceof File ? 'Download file' : 'Open link'}
            >
              {form.values.content instanceof File ? (
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
      ) : (
        <></>
      ),
    key: 'actions',
  }

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

  const extraDetailsContainer = {
    Item: () =>
      updatedExtraDetailsItems.length > 0 ? (
        <Card className="extra-details-card" hideBorderWhenSmall={true}>
          {updatedExtraDetailsItems.map(i => (
            <i.Item key={i.key} />
          ))}
        </Card>
      ) : (
        <></>
      ),
    key: 'extra-edtails-container',
  }

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

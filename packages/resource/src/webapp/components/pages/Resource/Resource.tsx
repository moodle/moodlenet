import { InsertDriveFile, Link } from '@material-ui/icons'
import {
  AddonItem,
  Card,
  IconTextOptionProps,
  Modal,
  OptionItemProp,
  PrimaryButton,
  SecondaryButton,
  TextOptionProps,
} from '@moodlenet/component-library'
import {
  FormikHandle,
  MainLayout,
  MainLayoutProps,
  SelectOptions,
  SelectOptionsMulti,
} from '@moodlenet/react-app/ui'
import { FC, useState } from 'react'
import { ResourceFormValues, ResourceType } from '../../../../common/types.mjs'
import {
  ContributorCard,
  ContributorCardProps,
} from '../../molecules/ContributorCard/ContributorCard.js'
import { ContributorCardStoryProps } from '../../molecules/ContributorCard/ContributorCard.stories.js'
import {
  MainResourceCard,
  MainResourceCardProps,
} from '../../organisms/MainResourceCard/MainResourceCard.js'
import './Resource.scss'

export type ResourceProps = {
  mainLayoutProps: MainLayoutProps
  mainResourceCardProps: MainResourceCardProps

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
  // form: FormikHandle<Omit<ResourceFormValues, 'addToCollections'>>

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
  mainResourceCardProps,
  mainColumnItems,
  sideColumnItems,
  // moreButtonItems,

  // resource,
  // editResource,
  deleteResource,
  // id: resourceId,
  // url: resourceUrl,
  contentType,
  // type,
  // resourceFormat,
  // contentUrl,
  // tags,

  // isAuthenticated,
  // canEdit,
  // isAdmin,
  // isOwner,
  // autoImageAdded,
}) => {
  // const form = useFormik<ResourceFormValues>({
  //   initialValues: resource,
  //   // validate:yup,
  //   onSubmit: values => {
  //     return editResource(values)
  //   },
  // })

  const [isEditing, setIsEditing] = useState<boolean>(
    // canSearchImage && autoImageAdded
    false,
  )
  //   const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
  //     useState<boolean>(false)
  //   const [isAddingToCollection, setIsAddingToCollection] =
  //     useState<boolean>(false)
  //   const [isAddingToMoodleLms, setIsAddingToMoodleLms] =
  //     useState<boolean>(false)
  const [isToDelete, setIsToDelete] = useState<boolean>(false)
  // const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
  // const backupImage: AssetInfo | null | undefined = useMemo(
  //   () => getBackupImage(resourceId),
  //   [resourceId],
  // )
  //   const [isReporting, setIsReporting] = useState<boolean>(false)
  //   const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
  // const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState<boolean>(false)
  // const [isEditing, toggleIsEditing] = useReducer(_ => !_, false)

  // const [imageUrl] = useImageUrl(form.values?.image?.location, backupImage?.location)

  const mainResourceCard = {
    Item: () => (
      <MainResourceCard
        {...mainResourceCardProps}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
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

  const updatedSideColumnItems = [contributorCard, actions, ...(sideColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const updatedMainColumnItems = [mainResourceCard, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
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

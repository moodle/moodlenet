import { InsertDriveFile, Link } from '@material-ui/icons'
import {
  AddonItem,
  Card,
  FollowTag,
  IconTextOptionProps,
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
import { FC } from 'react'
import { NewResourceFormValues } from '../../../../common/types.mjs'
import {
  ContributorCard,
  ContributorCardProps,
} from '../../molecules/ContributorCard/ContributorCard.js'
import { ContributorCardStoryProps } from '../../molecules/ContributorCard/ContributorCard.stories.js'
import './Resource.scss'

export type ResourceFormValues = Omit<NewResourceFormValues, 'addToCollections' | 'content'> & {
  isFile: boolean
}

export type ResourceProps = {
  mainLayoutProps: MainLayoutProps
  mainColumnItems?: AddonItem[]
  sideColumnItems?: AddonItem[]

  resourceId: string
  resourceUrl: string
  isAuthenticated: boolean
  isOwner: boolean
  isAdmin: boolean
  autoImageAdded: boolean
  canSearchImage: boolean
  numLikes: number
  collections: SelectOptionsMulti<OptionItemProp>
  liked: boolean
  bookmarked: boolean
  tags: FollowTag[]
  contributorCardProps: ContributorCardProps
  form: FormikHandle<Omit<ResourceFormValues, 'addToCollections'>>
  contentUrl: string
  toggleLikeForm: FormikHandle
  toggleBookmarkForm: FormikHandle
  deleteResourceForm?: FormikHandle
  addToCollectionsForm: FormikHandle<{ collections: string[] }>
  sendToMoodleLmsForm: FormikHandle<{ site?: string }>
  reportForm?: FormikHandle<{ comment: string }>
  resourceFormat: string
  contentType: 'link' | 'file'

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
}

export const Resource: FC<ResourceProps> = ({
  mainLayoutProps,
  mainColumnItems,
  sideColumnItems,

  contentType,
}) => {
  // const [isEditing, toggleIsEditing] = useReducer(_ => !_, false)

  // const resourCard: AddonItem = {
  //   Item: () => (
  //     <ResourceCard
  //       {...resourceCardProps}
  //       isEditing={isEditing}
  //       toggleIsEditing={toggleIsEditing}
  //     />
  //   ),
  //   key: 'resource-card',
  // }

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
          {/* <Trans> */}
          Send to Moodle
          {/* </Trans> */}
        </PrimaryButton>
        {/* {isAuthenticated && ( */}
        <SecondaryButton
        // onClick={() => setIsAddingToCollection(true)}
        >
          {/* <Trans> */}
          Add to Collection
          {/* </Trans> */}
        </SecondaryButton>
        {/* )} */}
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
                {/* <Trans> */}
                Download file
                {/* </Trans> */}
              </>
            ) : (
              <>
                <Link />
                {/* <Trans> */}
                Open link
                {/* </Trans> */}
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

  const updatedMainColumnItems = [contributorCard, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )
  return (
    <MainLayout {...mainLayoutProps}>
      {/* {modals} {snackbars} */}
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

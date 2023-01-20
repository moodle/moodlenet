import { InsertDriveFile, Link } from '@material-ui/icons'
import { AddonItem, Card, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'
import { MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui'
import { FC, useReducer } from 'react'
import { ContributorCard } from '../../molecules/ContributorCard/ContributorCard.js'
import { ContributorCardStoryProps } from '../../molecules/ContributorCard/ContributorCard.stories.js'
import {
  ResourceCard,
  ResourceCardPropsControlled,
} from '../../organisms/ResourceCard/ResourceCard.js'
import './Resource.scss'

export type ResourceProps = {
  mainLayoutProps: MainLayoutProps
  resourceCardProps: ResourceCardPropsControlled
  mainColumnItems?: AddonItem[]
  sideColumnItems?: AddonItem[]
}

export const Resource: FC<ResourceProps> = ({
  mainLayoutProps,
  resourceCardProps,
  mainColumnItems,
  sideColumnItems,
}) => {
  const [isEditing, toggleIsEditing] = useReducer(_ => !_, false)

  const resourCard: AddonItem = {
    Item: () => (
      <ResourceCard
        {...resourceCardProps}
        isEditing={isEditing}
        toggleIsEditing={toggleIsEditing}
      />
    ),
    key: 'resource-card',
  }

  const updatedMainColumnItems = [resourCard, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

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
            {/* {contentType === 'file' ? ( */}
            <>
              <InsertDriveFile />
              {/* <Trans> */}
              Download file
              {/* </Trans> */}
            </>
            {/* ) : ( */}
            <>
              <Link />
              {/* <Trans> */}
              Open link
              {/* </Trans> */}
            </>
            {/* )} */}
          </SecondaryButton>
        </a>
      </Card>
    ),
    key: 'actions',
  }

  const updatedSideColumnItems = [contributorCard, actions, ...(sideColumnItems ?? [])].filter(
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

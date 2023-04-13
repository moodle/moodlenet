import { Href, ListCard, SecondaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { ArrowForwardRounded } from '@mui/icons-material'
import { FC, useMemo } from 'react'
import ResourceCard, { ResourceCardProps } from '../../ResourceCard/ResourceCard.js'
import './LandingResourceList.scss'

export type LandingResourceListProps = {
  resourceCardPropsList: ResourceCardProps[]
  searchResourcesHref: Href
}

export const LandingResourceList: FC<LandingResourceListProps> = ({
  resourceCardPropsList,
  searchResourcesHref,
}) => {
  return (
    <ListCard
      className="landing-resource-list"
      content={useMemo(
        () =>
          resourceCardPropsList.map(resourceCardProps => {
            return (
              <ResourceCard
                key={resourceCardProps.data.resourceId}
                {...resourceCardProps}
                orientation="vertical"
              />
            )
          }),
        [resourceCardPropsList],
      )}
      header={
        <div className="card-header">
          <div className="info">
            <div className="title">Featured resources</div>
            <div className="subtitle">Highlights on top quality content</div>
          </div>
          {
            <SecondaryButton className="more" color="dark-blue">
              <Link href={searchResourcesHref}>See more resources</Link>
              <ArrowForwardRounded />
            </SecondaryButton>
          }
        </div>
      }
      noCard={true}
      minGrid={245}
      maxRows={2}
    />
  )
}

LandingResourceList.defaultProps = {}

export default LandingResourceList

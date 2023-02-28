import { Href, ListCard, SecondaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { ArrowForwardRounded } from '@mui/icons-material'
import { FC } from 'react'
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
      content={resourceCardPropsList.slice(0, 10).map(resourceCardProps => (
        <ResourceCard
          {...resourceCardProps}
          key={resourceCardProps.resourceId}
          orientation="vertical"
        />
      ))}
      title={
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
      maxHeight={736}
      // maxRows={2}
    />
  )
}

LandingResourceList.defaultProps = {}

export default LandingResourceList

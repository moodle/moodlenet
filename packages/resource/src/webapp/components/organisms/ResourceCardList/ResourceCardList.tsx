import { ListCard } from '@moodlenet/component-library'
import { FC } from 'react'
import ResourceCard, { ResourceCardProps } from '../ResourceCard/ResourceCard.js'
import './ResourceCardList.scss'

export type ResourceCardListProps = {
  resourceCardPropsList: ResourceCardProps[]
}

export const ResourceCardList: FC<ResourceCardListProps> = ({ resourceCardPropsList }) => {
  return (
    <ListCard
      className="resource-list"
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
            //   <SecondaryButton className="more" color="dark-blue">
            //     <Link href={searchResourcesHref}>
            //       See more resources
            //     </Link>
            //     {/* <ArrowForwardRoundedIcon /> */}
            //   </SecondaryButton>
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

ResourceCardList.defaultProps = {}

export default ResourceCardList

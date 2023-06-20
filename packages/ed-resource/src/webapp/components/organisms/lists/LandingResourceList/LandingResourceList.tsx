import type { Href } from '@moodlenet/component-library'
import { ListCard, SecondaryButton } from '@moodlenet/component-library'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import { Link } from '@moodlenet/react-app/ui'
import { ArrowForwardRounded } from '@mui/icons-material'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ResourceCardPropsData } from '../../ResourceCard/ResourceCard.js'
import ResourceCard from '../../ResourceCard/ResourceCard.js'
import './LandingResourceList.scss'

export type LandingResourceListProps = {
  resourceCardPropsList: { props: ProxyProps<ResourceCardPropsData>; key: string }[]
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
          resourceCardPropsList.map(({ key, props }) => {
            return { key, el: <ResourceCard key={key} {...props} orientation="vertical" /> }
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

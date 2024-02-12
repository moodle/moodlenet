import type { Href } from '@moodlenet/component-library'
import { ListCard } from '@moodlenet/component-library'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ResourceCardPropsData } from '../../ResourceCard/ResourceCard.js'
import ResourceCard from '../../ResourceCard/ResourceCard.js'
import './LandingResourceList.scss'

export type LandingResourceListProps = {
  resourceCardPropsList: { props: ProxyProps<ResourceCardPropsData>; key: string }[]
  searchResourcesHref: Href
  hasSetInterests: boolean
}

export const LandingResourceList: FC<LandingResourceListProps> = ({
  resourceCardPropsList,
  hasSetInterests,
  // searchResourcesHref,
}) => {
  const title = (
    <div className="title">{hasSetInterests ? 'Resources selection' : 'Featured resources'}</div>
  )

  const subtitle = (
    <div className="subtitle">
      {hasSetInterests
        ? 'Top resources aligned with your interests'
        : 'Highlights on top quality content'}
    </div>
  )
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
            {title}
            {subtitle}
          </div>
          {/* <SecondaryButton className="more" color="dark-blue">
            <Link href={searchResourcesHref}>See more resources</Link>
            <ArrowForwardRounded />
          </SecondaryButton> */}
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

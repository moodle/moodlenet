import { ArrowForwardRounded } from '@material-ui/icons'
import type { Href } from '@moodlenet/component-library'
import { ListCard, SecondaryButton } from '@moodlenet/component-library'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import { Link } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { CollectionCardProps } from '../../CollectionCard/CollectionCard.js'
import { CollectionCard } from '../../CollectionCard/CollectionCard.js'
import './LandingCollectionList.scss'

export type LandingCollectionListProps = {
  searchCollectionsHref: Href
  collectionCardPropsList: { props: ProxyProps<CollectionCardProps>; key: string }[]
}

export const LandingCollectionList: FC<LandingCollectionListProps> = ({
  collectionCardPropsList,
  searchCollectionsHref,
}) => {
  return (
    <ListCard
      className="landing-collection-list"
      content={useMemo(
        () =>
          collectionCardPropsList
            .slice(0, 20)
            .map(({ key, props }) => <CollectionCard key={key} {...props} />),
        [collectionCardPropsList],
      )}
      header={
        <div className="card-header">
          <div className="info">
            <div className="title">Featured collections</div>
            <div className="subtitle">Great collections of curated resources</div>
          </div>
          {
            <SecondaryButton className="more" color="dark-blue">
              <Link href={searchCollectionsHref}>See more collections</Link>
              <ArrowForwardRounded />
            </SecondaryButton>
          }
        </div>
      }
      minGrid={245}
      noCard={true}
      maxRows={2}
    />
  )
}

LandingCollectionList.defaultProps = {}

export default LandingCollectionList

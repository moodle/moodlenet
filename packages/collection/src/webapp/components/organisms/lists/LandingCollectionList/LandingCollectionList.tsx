import { ArrowForwardRounded } from '@material-ui/icons'
import { Href, ListCard, SecondaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { FC, useMemo } from 'react'
import { CollectionCard, CollectionCardProps } from '../../CollectionCard/CollectionCard.js'
import './LandingCollectionList.scss'

export type LandingCollectionListProps = {
  searchCollectionsHref: Href
  collectionCardPropsList: CollectionCardProps[]
}

export const LandingCollectionList: FC<LandingCollectionListProps> = ({
  collectionCardPropsList,
  searchCollectionsHref,
}) => {
  return (
    <ListCard
      className="landing-collection-card-list"
      content={useMemo(
        () =>
          collectionCardPropsList
            .slice(0, 20)
            .map(collectionCardProps => (
              <CollectionCard
                key={collectionCardProps.data.collectionId}
                {...collectionCardProps}
              />
            )),
        [collectionCardPropsList],
      )}
      title={
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
      maxHeight={397}
      // maxRows={2}
    />
  )
}

LandingCollectionList.defaultProps = {}

export default LandingCollectionList

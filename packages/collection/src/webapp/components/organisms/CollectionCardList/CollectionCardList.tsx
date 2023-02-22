import { ArrowForwardRounded } from '@material-ui/icons'
import { Href, ListCard, SecondaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { FC } from 'react'
import { CollectionCard, CollectionCardProps } from '../CollectionCard/CollectionCard.js'
import './CollectionCardList.scss'

export type CollectionCardListProps = {
  searchCollectionsHref: Href
  collectionCardPropsList: CollectionCardProps[]
}

export const CollectionCardList: FC<CollectionCardListProps> = ({
  collectionCardPropsList,
  searchCollectionsHref,
}) => {
  return (
    <ListCard
      className="collections"
      content={collectionCardPropsList.slice(0, 20).map(collectionCardProps => (
        <CollectionCard key={collectionCardProps.collectionId} {...collectionCardProps} />
      ))}
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

CollectionCardList.defaultProps = {}

export default CollectionCardList

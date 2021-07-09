import { t } from '@lingui/macro'
import { FC } from 'react'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { ListCard } from '../../components/cards/ListCard/ListCard'
import { OverallCard, OverallCardProps } from '../../components/cards/OverallCard/OverallCard'
import { ProfileCard, ProfileCardProps } from '../../components/cards/ProfileCard/ProfileCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { ScoreCard, ScoreCardProps } from '../../components/cards/ScoreCard/ScoreCard'
import './styles.scss'

export type ProfileProps = {
  overallCardProps: OverallCardProps
  scoreCardProps: ScoreCardProps
  profileCardProps: ProfileCardProps
  collectionCardPropsList: CollectionCardProps[]
  resourceCardPropsList: ResourceCardProps[]
  username: string
}

export const Profile: FC<ProfileProps> = ({
  overallCardProps,
  profileCardProps,
  scoreCardProps,
  collectionCardPropsList,
  resourceCardPropsList,
  username,
}) => {
  return (
    <div className="profile">
      <div className="content">
        <div className="main-column">
          <ProfileCard {...profileCardProps} />
          <ListCard
            content={resourceCardPropsList.map(resourcesCardProps => (
              <ResourceCard {...resourcesCardProps} />
            ))}
            title={t`Latest Resources`}
            className="resources"
          />
        </div>
        <div className="side-column">
          <ScoreCard {...scoreCardProps} />
          <OverallCard {...overallCardProps} />
          <ListCard
            title={t`Collections curated by ${username}`}
            content={collectionCardPropsList.map(collectionCardProps => (
              <CollectionCard {...collectionCardProps} />
            ))}
            className="collections"
          />
        </div>
      </div>
    </div>
  )
}

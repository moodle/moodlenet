import { t } from '@lingui/macro'
import { FC } from 'react'
import { CollectionCard, CollectionCardProps } from '../../components/CollectionCard/CollectionCard'
import { ListCard } from '../../components/ListCard/ListCard'
import { ProfileCard, ProfileCardProps } from '../../components/ProfileCard/ProfileCard'
import { ResourceCard, ResourceCardProps } from '../../components/ResourceCard/ResourceCard'
import { ScoreCard, ScoreCardProps } from '../../components/ScoreCard/ScoreCard'
import TextCard from '../../components/TextCard/TextCard'
import { Organization } from '../../types'
import './styles.scss'

export type LandingProps = {
  scoreCardProps: ScoreCardProps
  profileCardProps: ProfileCardProps
  collectionCardPropsList: CollectionCardProps[]
  resourceCardPropsList: ResourceCardProps[]
  organization: Pick<Organization,  "name" | "intro">
}

export const Landing: FC<LandingProps> = ({
  profileCardProps,
  scoreCardProps,
  collectionCardPropsList,
  resourceCardPropsList,
  organization,
}) => {
  return (
    <div className="landing">
      <div className="landing-title">
        <div className="moodle-title">Welcome to MoodleNet</div>
        <div className="organization-title">{organization.name}</div>
      </div>
      <div className="content">
        <div className="main-column">
          <TextCard>
            {organization.intro}
            <span style={{color: '#b6bacb'}}>Welcome!</span>
          </TextCard>
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
          <ListCard
            title={t`Collections curated by`}
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

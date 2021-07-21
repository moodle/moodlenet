import { t } from '@lingui/macro'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { ListCard } from '../../components/cards/ListCard/ListCard'
import { OverallCard, OverallCardProps } from '../../components/cards/OverallCard/OverallCard'
import { ProfileCard, ProfileCardProps } from '../../components/cards/ProfileCard/ProfileCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { ScoreCardProps } from '../../components/cards/ScoreCard/ScoreCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type ProfileProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  overallCardProps: OverallCardProps
  scoreCardProps: ScoreCardProps
  profileCardProps: ProfileCardProps
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  username: string
}

export const Profile = withCtrl<ProfileProps>(
  ({
    headerPageTemplateProps,
    overallCardProps,
    profileCardProps,
    scoreCardProps,
    collectionCardPropsList,
    resourceCardPropsList,
    username,
  }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="profile">
          <div className="content">
            <div className="main-column">
              <ProfileCard {...profileCardProps} />
              <ListCard
                content={resourceCardPropsList.map(resourcesCardProps => {
                  return <ResourceCard {...resourcesCardProps} />
                })}
                title={t`Latest Resources`}
                className="resources"
              />
              <ListCard
                title={t`Collections curated by ${username}`}
                content={collectionCardPropsList.map(collectionCardProps => (
                  <CollectionCard {...collectionCardProps} />
                ))}
                className="collections"
              />
            </div>
            <div className="side-column">
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
      </HeaderPageTemplate>
    )
  },
)
Profile.displayName = 'ProfilePage'

import { t } from '@lingui/macro'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { ListCard } from '../../components/cards/ListCard/ListCard'
import { OverallCard, OverallCardProps } from '../../components/cards/OverallCard/OverallCard'
import { ProfileCard, ProfileCardProps } from '../../components/cards/ProfileCard/ProfileCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { ScoreCard, ScoreCardProps } from '../../components/cards/ScoreCard/ScoreCard'
import { WithProps, WithPropsList } from '../../lib/ctrl'
import { withProps, WithProps as WP } from '../../lib/__/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type ProfileProps = {
  headerPageTemplateWithProps: WithProps<HeaderPageTemplateProps>
  overallCardProps: OverallCardProps
  scoreCardProps: ScoreCardProps
  profileCardProps: ProfileCardProps
  collectionCardWithPropsList: WithPropsList<CollectionCardProps>
  resourceCardWithPropsList: WP<ResourceCardProps>[]
  username: string
}

export const Profile = withProps<ProfileProps>(function Profile({
  headerPageTemplateWithProps,
  overallCardProps,
  profileCardProps,
  scoreCardProps,
  collectionCardWithPropsList,
  resourceCardWithPropsList,
  username,
}) {
  console.log({ headerPageTemplateWithProps })
  const [HeaderPageTemplateCtrl, headerPageTemplateProps] = headerPageTemplateWithProps(HeaderPageTemplate)
  console.log({ HeaderPageTemplateCtrl, headerPageTemplateProps })
  const [CollectionCardCtrl, collectionCardPropsList] = collectionCardWithPropsList(CollectionCard)
  return (
    <HeaderPageTemplateCtrl {...headerPageTemplateProps}>
      <div className="profile">
        <div className="content">
          <div className="main-column">
            <ProfileCard {...profileCardProps} />
            <ListCard
              content={resourceCardWithPropsList.map(resourcesCardProps => {
                return <ResourceCard {...resourcesCardProps} />
              })}
              title={t`Latest Resources`}
              className="resources"
            />
            <ListCard
              title={t`Collections curated by ${username}`}
              content={collectionCardPropsList.map(collectionCardProps => (
                <CollectionCardCtrl {...collectionCardProps} />
              ))}
              className="collections"
            />
          </div>
          <div className="side-column">
            <ScoreCard {...scoreCardProps} />
            <OverallCard {...overallCardProps} />
            <ListCard
              title={t`Collections curated by ${username}`}
              content={collectionCardPropsList.map(collectionCardProps => (
                <CollectionCardCtrl {...collectionCardProps} />
              ))}
              className="collections"
            />
          </div>
        </div>
      </div>
    </HeaderPageTemplateCtrl>
  )
})

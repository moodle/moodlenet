import { t } from '@lingui/macro'
import { FC } from 'react'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { ListCard } from '../../components/cards/ListCard/ListCard'
import { OverallCard, OverallCardProps } from '../../components/cards/OverallCard/OverallCard'
import { ProfileCard, ProfileCardProps } from '../../components/cards/ProfileCard/ProfileCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { ScoreCard, ScoreCardProps } from '../../components/cards/ScoreCard/ScoreCard'
import { WithProps, WithPropsList } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type ProfileProps = {
  withHeaderPageTemplateProps: WithProps<HeaderPageTemplateProps>
  overallCardProps: OverallCardProps
  scoreCardProps: ScoreCardProps
  profileCardProps: ProfileCardProps
  withCollectionCardPropsList: WithPropsList<CollectionCardProps>
  withResourceCardPropsList: WithPropsList<ResourceCardProps>
  username: string
}

export const Profile: FC<ProfileProps> = ({
  withHeaderPageTemplateProps,
  overallCardProps,
  profileCardProps,
  scoreCardProps,
  withCollectionCardPropsList,
  withResourceCardPropsList,
  username,
}) => {
  const [HeaderPageTemplateWithProps, headerPageTemplateProps] = withHeaderPageTemplateProps(HeaderPageTemplate)
  const [CollectionCardWithProps, collectionCardPropsList] = withCollectionCardPropsList(CollectionCard)
  const [ResourceCardWithProps, resourceCardPropsList] = withResourceCardPropsList(ResourceCard)
  return (
    <HeaderPageTemplateWithProps {...headerPageTemplateProps}>
      <div className="profile">
        <div className="content">
          <div className="main-column">
            <ProfileCard {...profileCardProps} />
            <ListCard
              content={resourceCardPropsList.map(resourcesCardProps => (
                <ResourceCardWithProps {...resourcesCardProps} />
              ))}
              title={t`Latest Resources`}
              className="resources"
            />
            <ListCard
              title={t`Collections curated by ${username}`}
              content={collectionCardPropsList.map(collectionCardProps => (
                <CollectionCardWithProps {...collectionCardProps} />
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
                <CollectionCardWithProps {...collectionCardProps} />
              ))}
              className="collections"
            />
          </div>
        </div>
      </div>
    </HeaderPageTemplateWithProps>
  )
}

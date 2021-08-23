import { t } from '@lingui/macro'
import { useState } from 'react'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { ListCard } from '../../components/cards/ListCard/ListCard'
import { OverallCard, OverallCardProps } from '../../components/cards/OverallCard/OverallCard'
import { ProfileCard, ProfileCardProps } from '../../components/cards/ProfileCard/ProfileCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type ProfileProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  overallCardProps: OverallCardProps
  profileCardProps: Omit<ProfileCardProps, 'isEditing' | 'toggleIsEditing'>
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  username: string
  save: () => unknown
}

export const Profile = withCtrl<ProfileProps>(
  ({
    headerPageTemplateProps,
    overallCardProps,
    profileCardProps,
    collectionCardPropsList,
    resourceCardPropsList,
    username,
    save,
  }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const toggleIsEditing = () => {
      setIsEditing(!isEditing)
      if (isEditing) {
        save()
      }
    }

    const collectionList = (
      <ListCard
        title={`${t`Collections curated by`} ${username}`}
        content={collectionCardPropsList.map(collectionCardProps => (
          <CollectionCard {...collectionCardProps} isEditing={isEditing} />
        ))}
        className="collections"
      />
    )

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="profile">
          <div className="content">
            <div className="main-column">
              <ProfileCard {...profileCardProps} isEditing={isEditing} toggleIsEditing={toggleIsEditing} />
              <ListCard
                content={resourceCardPropsList.map(resourcesCardProps => {
                  return <ResourceCard {...resourcesCardProps} isEditing={isEditing} />
                })}
                title={t`Latest Resources`}
                className="resources"
              />
              {collectionList}
            </div>
            <div className="side-column">
              <OverallCard {...overallCardProps} />
              {collectionList}
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
Profile.displayName = 'ProfilePage'

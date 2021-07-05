import { t } from '@lingui/macro'
import { FC } from 'react'
import { CollectionCard, CollectionCardProps } from '../../components/CollectionCard/CollectionCard'
import { ListCard } from '../../components/ListCard/ListCard'
import { OverallCard, OverallCardProps } from '../../components/OverallCard/OverallCard'
import { ProfileCard, ProfileCardProps } from '../../components/ProfileCard/ProfileCard'
import { ResourceCard, ResourceCardProps } from '../../components/ResourceCard/ResourceCard'
//import ListCard from '../../components/ListCard/ListCard';
//import ResourceCard from 'components/ResourceCard/index';
import { ScoreCard, ScoreCardProps } from '../../components/ScoreCard/ScoreCard'
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
  /*
  let resources = user.resources.map((value, index) => {
    return <ResourceCard 
      key={index}
      type={value.type} 
      title={value.title} 
      tags={value.tags}
      image={value.image} />
  });

  let collections = user.collections.map((value, index) => {
    return <CollectionCard 
      key={index}
      title={value.title} 
      image={value.image} />
  });
  */

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
          {/* <ListCard title= {"Latest Resources"} content={resources}/> */}
          {/* <ListCard className="collection" title={'Collections Curated by ' + user.first_name} content={collections}/> */}
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

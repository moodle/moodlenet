
import { FC } from 'react';
import { ListCard, ListCardProps } from '../../components/ListCard/ListCard';
import { OverallCard, OverallCardProps } from '../../components/OverallCard/OverallCard';
import { ProfileCard, ProfileCardProps } from '../../components/ProfileCard/ProfileCard';
//import ListCard from '../../components/ListCard/ListCard';
//import ResourceCard from 'components/ResourceCard/index';
import { ScoreCard, ScoreCardProps } from '../../components/ScoreCard/ScoreCard';
import "./styles.scss";

export type ProfileProps =   {
  overallCardProps: OverallCardProps,
  scoreCardProps: ScoreCardProps,
  profileCardProps: ProfileCardProps,
  collectionListCardProps: ListCardProps,
  resourcesListCardProps: ListCardProps,
}

export const Profile: FC <ProfileProps> = ({
  overallCardProps,
  profileCardProps,
  scoreCardProps,
  collectionListCardProps,
  resourcesListCardProps
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
          <ProfileCard {...profileCardProps}/>
          <ListCard {...resourcesListCardProps}/>
          {/* <ListCard title= {"Latest Resources"} content={resources}/> */}
          {/* <ListCard className="collection" title={'Collections Curated by ' + user.first_name} content={collections}/> */}
        </div>
        <div className="side-column">
          <ScoreCard {...scoreCardProps}/>
          <OverallCard {...overallCardProps} />
          <ListCard {...collectionListCardProps}/>
        </div>
      </div>
    </div>
  );
}
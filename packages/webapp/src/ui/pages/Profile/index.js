import React from "react";
import "./styles.scss";
import ProfileCard from 'components/ProfileCard/index';
import ListCard from 'components/ListCard/index';
import ResourceCard from 'components/ResourceCard/index';
import ScoreCard from 'components/ScoreCard/index';
import OverallCard from 'components/OverallCard/index';
import CollectionCard from 'components/CollectionCard/index';

function Profile(props) {
  let user = props.user;

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
  

  return (
    <div className="profile">
      <div className="content">
        <div className="main-column">
          <ProfileCard user={user}/>
          <ListCard title= {"Latest Resources"} content={resources}/>
          <ListCard className="collection" title={'Collections Curated by ' + user.first_name} content={collections}/>
        </div>
        <div className="side-column">
          <ScoreCard points={user.points} kudos={user.kudos}/>
          <OverallCard followers={user.followers} resources={user.num_resources} years={user.antiquity} />
          <ListCard title={'Collections Curated by ' + user.first_name} content={collections}/>
        </div>
      </div>
    </div>
  );
}

export default Profile;

import React from "react";
import "./styles.scss";
import verifiedIcon from 'assets/icons/verified.svg'

function ProfileCard(props) {
  let user = props.user
  return (
    <div className="profile-card">
        <img className="background" src={user.background} alt="Background"/>
        <img className="avatar" src={user.avatar} alt="Avatar"/>
        <div className="info">
            <div className="title">
                {user.first_name} {user.last_name}
                <img className="verified-icon" src={verifiedIcon} alt="Verified"/>
            </div>
            <div className="subtitle">
                @{user.username}&nbsp; · &nbsp;
                {user.organization.name} MoodleNet&nbsp; | &nbsp;
                {user.location}&nbsp; · &nbsp;
                <span style={{cursor: "pointer"}}>{user.site}</span> 
            </div>
            <div className="presentation">
                {user.description} 
            </div>
            <div className="buttons">
                <div className="edit button">Edit Profile</div>
                <div className="settings button">Go to Setting</div>
            </div>
        </div>
    </div>
  );
}

export default ProfileCard;

import { FC } from 'react';
import verifiedIcon from '../../assets/icons/verified.svg';
import "./styles.scss";

export type ProfileCardProps = {
    backgroundUrl: string,
    username: string,
    avatarUrl: string,
    firstName: string,
    lastName: string,
    organizationName: string,
    location: string,
    siteUrl: string,
    description: string
}

export const ProfileCard: FC<ProfileCardProps> = ({
    avatarUrl,
    username,
    backgroundUrl,
    description,
    firstName,
    lastName,
    location,
    organizationName,
    siteUrl
}) => {
  return (
    <div className="profile-card">
        <img className="background" src={backgroundUrl} alt="Background"/>
        <img className="avatar" src={avatarUrl} alt="Avatar"/>
        <div className="info">
            <div className="title">
                {firstName} {lastName}
                <img className="verified-icon" src={verifiedIcon} alt="Verified"/>
            </div>
            <div className="subtitle">
                @{username}&nbsp; · &nbsp;
                {organizationName} MoodleNet&nbsp; | &nbsp;
                {location}&nbsp; · &nbsp;
                <span style={{cursor: "pointer"}}>{siteUrl}</span> 
            </div>
            <div className="presentation">
                {description} 
            </div>
            <div className="buttons">
                <div className="edit button">Edit Profile</div>
                <div className="settings button">Go to Setting</div>
            </div>
        </div>
    </div>
  );
}


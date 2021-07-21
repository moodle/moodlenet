import { FC } from 'react';
import "./styles.scss";

export type OverallCardProps = {
    followers: number,
    resources: number,
    years: number,
    kudos: number
}

export const OverallCard: FC<OverallCardProps> = ({followers, resources, kudos}) => {
  return (
    <div className="overall-card">
        <div className="data">{followers}<span>Followers</span></div>
        <div className="data">{kudos}<span>Kudos</span></div>
        <div className="data">{resources}<span>Resources</span></div>
        {/*<div className="data">{props.years} years ago<span>Joined</span></div>*/}
    </div>
  );
}

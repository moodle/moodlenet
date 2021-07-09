import { FC } from 'react';
import "./styles.scss";

export type OverallCardProps = {
    followers: number,
    resources: number,
    years: number
}

export const OverallCard: FC<OverallCardProps> = (props) => {
  return (
    <div className="overall-card">
        <div className="data followers">{props.followers}<span>Followers</span></div>
        <div className="separator"></div>
        <div className="data">{props.resources}<span>Resources</span></div>
        <div className="data">{props.years} years ago<span>Joined</span></div>
    </div>
  );
}

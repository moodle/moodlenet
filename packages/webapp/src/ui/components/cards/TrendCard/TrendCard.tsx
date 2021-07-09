import { Trans } from '@lingui/macro';
import { FC } from "react";
import { FollowTag } from '../../../types';
import "./styles.scss";

export type TrendCardProps = {
  tags: FollowTag[]
}

export const TrendCard: FC <TrendCardProps> = ({tags}) => {

  const tagList = tags.map((value, index) => {
    return <div 
      key={index}
      className={'tag tag' + value.type}
    >{value.name}</div>
  })

  return (
    <div className="trend-card">
        <div className="title"><Trans>
          Trending <span className="light-font">Subjects</span> & 
          <span className="light-font">Collections</span>
        </Trans></div>
        <div className="content">
          <div className="gradient-bar"></div>
          <div className="tags">{tagList}</div>
        </div>
    </div>
  );
}

export default TrendCard;

import { Trans } from '@lingui/macro';
import { FC } from 'react';
import Card from '../../../components/atoms/Card/Card';
import "./styles.scss";

export type CategoryOverallCardProps = {
    followers: number
    collections: number
    resources: number
    hideBorderWhenSmall?: boolean
}

export const CategoryOverallCard: FC<CategoryOverallCardProps> = ({followers, collections, resources, hideBorderWhenSmall}) => {
  return (
    <Card className="category-overall-card" hideBorderWhenSmall={hideBorderWhenSmall}>
        <div className="data">{followers}<span><Trans>Followers</Trans></span></div>
        <div className="data">{collections}<span><Trans>Collections</Trans></span></div>
        <div className="data">{resources}<span><Trans>Resources</Trans></span></div>
        {/*<div className="data">{props.years} years ago<span>Joined</span></div>*/}
    </Card>
  );
}

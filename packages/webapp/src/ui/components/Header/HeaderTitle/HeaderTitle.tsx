import { FC } from 'react';
import { Organization } from '../../../types';
import './styles.scss';

export type HeaderTitleProps = {
    organization: Pick<Organization, "logo"|"name"|"url">
}

export const HeaderTitle: FC<HeaderTitleProps> = ({organization}) => {
  return (
    <div className="header-title">
      <a href={organization.url} rel="noopener noreferrer" target="_blank">
        <img className="logo" src={organization.logo} alt="Logo"/>
      </a>
      <a href="https://moodle.com/moodlenet/" rel="noopener noreferrer" target="_blank">
        <div className="text">MoodleNet</div>
      </a>
    </div>
  )
}

export default HeaderTitle;

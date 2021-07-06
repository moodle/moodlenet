import { FC } from 'react';
import addIcon from '../../assets/icons/add.svg';
import searchIcon from '../../assets/icons/search.svg';
import { Organization } from '../../types';
import './styles.scss';

export type HeaderProps = {
    organization: Organization
    avatar: string
}

export const Header: FC<HeaderProps> = ({organization, avatar}) => {
  return (
    <div className="header">
      <div className="content">
        <div className="left">
          <a href={organization.url} rel="noopener noreferrer" target="_blank">
            <img className="logo" src={organization.logo} alt="Logo"/>
          </a>
          <a href="https://moodle.com/moodlenet/" rel="noopener noreferrer" target="_blank">
            <div className="text">MoodleNet</div>
          </a>
        </div>
        <div className="right">
          <img className="big-search-icon" src={searchIcon} alt="Search"/>
          <div className='search-box'>
            <img className="search-icon" src={searchIcon} alt="Search"/>
            <input className="search-text" placeholder="Search for anything!"/>
          </div>
          <img className="add-icon" src={addIcon} alt="Add"/>
          <img className="avatar" src={avatar} alt="Avatar"/>
        </div>
        </div>
    </div>
  )
}

export default Header;

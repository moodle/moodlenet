import { FC } from 'react';
import { Header, HeaderProps } from '../../components/Header/Header';
import { SubHeader, SubHeaderProps } from '../../components/SubHeader/SubHeader';
import { Profile, ProfileProps } from '../Profile/Profile';
import './styles.scss';

export type LoggedInProps = {
  profileProps: ProfileProps
  headerProps: HeaderProps
  subheaderProps: SubHeaderProps
}

export const LoggedIn: FC<LoggedInProps> = ({headerProps, subheaderProps, profileProps}) => {
  return (
    <div className="app">
      <Header {...headerProps}/>
      <SubHeader {...subheaderProps}/>
      <Profile {...profileProps}/>
    </div>
  );
}
import React, { FC } from 'react';
import { Header, HeaderProps } from '../../components/Header/Header';
import { SubHeader, SubHeaderProps } from '../../components/SubHeader/SubHeader';
import './styles.scss';

export type LoggedInProps = {
  headerProps: HeaderProps
  subheaderProps: SubHeaderProps
  view: React.ReactNode
}

export const LoggedIn: FC<LoggedInProps> = ({headerProps, subheaderProps, view}) => {
  return (
    <div className="loggedin-page">
      <Header {...headerProps}/>
      <SubHeader {...subheaderProps}/>
      <div className="view">{view}</div>
    </div>
  );
}
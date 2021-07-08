import React, { FC } from 'react';
import AccessHeader, { AccessHeaderProps } from './AccessHeader/AccessHeader';
import './styles.scss';

export type AccessProps = {
  accessHeaderProps: AccessHeaderProps
  view: React.ReactNode
}

export const Access: FC<AccessProps> = ({accessHeaderProps, view}) => {
  return (
    <div className="access-page">
      <AccessHeader {...accessHeaderProps}/>
      <div className="view">{view}</div>
    </div>
  );
}
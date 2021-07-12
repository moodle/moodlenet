import React, { FC } from 'react';
import { MainPageWrapper } from '../../templates/page/MainPageWrapper';
import AccessHeader, { AccessHeaderProps } from './AccessHeader/AccessHeader';
import './styles.scss';

export type AccessProps = {
  accessHeaderProps: AccessHeaderProps
  view: React.ReactNode
}

export const Access: FC<AccessProps> = ({accessHeaderProps}) => {
  return (
    <MainPageWrapper>
      <div className="access-page">
        <AccessHeader {...accessHeaderProps}/>
      </div>
    </MainPageWrapper>
  );
}
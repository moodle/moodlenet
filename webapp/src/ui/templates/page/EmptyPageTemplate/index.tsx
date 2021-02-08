import { FC } from 'react';
import { MainPageWrapper } from '../MainPageWrapper';

export const EmptyPageTemplate: FC<EmptyPageTemplateProps> = ({ children }) => {
  return <MainPageWrapper>{children}</MainPageWrapper>;
};

export type EmptyPageTemplateProps = {};

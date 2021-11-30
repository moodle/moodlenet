import { FC } from 'react'
import { CP } from '../../lib/ctrl'
import { MainPageWrapper, MainPageWrapperProps } from './MainPageWrapper'

export type EmptyPageTemplateProps = {
  mainPageWrapperProps: CP<MainPageWrapperProps>
}

export const EmptyPageTemplate: FC<EmptyPageTemplateProps> = ({
  children,
  mainPageWrapperProps,
}) => {
  return <MainPageWrapper {...mainPageWrapperProps}>{children}</MainPageWrapper>
}
EmptyPageTemplate.displayName = 'EmptyPageTemplate'

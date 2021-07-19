import { FC } from 'react'
import { MainPageWrapper } from './MainPageWrapper'

export type EmptyPageTemplateProps = {}

export const EmptyPageTemplate: FC<EmptyPageTemplateProps> = ({ children }) => {
  return <MainPageWrapper>{children}</MainPageWrapper>
}
EmptyPageTemplate.displayName = 'EmptyPageTemplate'

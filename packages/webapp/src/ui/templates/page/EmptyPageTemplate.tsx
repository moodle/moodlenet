import { FC } from 'react'
import { MainPageWrapper } from './MainPageWrapper'

export type EmptyPageTemplateProps = {
  userAcceptsCookies: (() => unknown) | null
}

export const EmptyPageTemplate: FC<EmptyPageTemplateProps> = ({ children, userAcceptsCookies }) => {
  return <MainPageWrapper userAcceptsCookies={userAcceptsCookies}>{children}</MainPageWrapper>
}
EmptyPageTemplate.displayName = 'EmptyPageTemplate'

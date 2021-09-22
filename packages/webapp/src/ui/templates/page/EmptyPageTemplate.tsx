import { FC } from 'react'
import { MainPageWrapper } from './MainPageWrapper'

export type EmptyPageTemplateProps = {
  userAcceptsPolicies: (() => unknown) | null
}

export const EmptyPageTemplate: FC<EmptyPageTemplateProps> = ({ children, userAcceptsPolicies }) => {
  return <MainPageWrapper userAcceptsPolicies={userAcceptsPolicies}>{children}</MainPageWrapper>
}
EmptyPageTemplate.displayName = 'EmptyPageTemplate'

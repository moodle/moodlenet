import { FC } from 'react'
import { ActivateNewUserPanel, ActivateNewUserPanelProps } from '../components/ActivateUserPanel'
import { EmptyPageTemplate } from '../templates/page/EmptyPageTemplate'
export * from '../components/ActivateUserPanel'

export type ActivateNewUserPageProps = {
  activateNewUserPanelProps: ActivateNewUserPanelProps
}

export const ActivateNewUserPage: FC<ActivateNewUserPageProps> = ({ activateNewUserPanelProps }) => {
  return (
    <EmptyPageTemplate>
      <ActivateNewUserPanel {...activateNewUserPanelProps} />
    </EmptyPageTemplate>
  )
}

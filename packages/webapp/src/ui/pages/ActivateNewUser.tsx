import { FC } from 'react'
import { ActivateNewUserPanel, UseActivateNewUserPanelProps } from '../components/ActivateUserPanel'
import { UsePageHeaderProps } from '../components/PageHeader'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'
export * from '../components/ActivateUserPanel'

export type ActivateNewUserPageProps = {
  useActivateNewUserPanelProps: UseActivateNewUserPanelProps
  usePageHeaderProps: UsePageHeaderProps
}

export const ActivateNewUserPage: FC<ActivateNewUserPageProps> = ({
  usePageHeaderProps,
  useActivateNewUserPanelProps,
}) => {
  return (
    <HeaderPageTemplate useProps={usePageHeaderProps}>
      <ActivateNewUserPanel useProps={useActivateNewUserPanelProps} />
    </HeaderPageTemplate>
  )
}

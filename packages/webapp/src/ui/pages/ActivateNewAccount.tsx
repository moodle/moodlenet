import { FC } from 'react'
import { ActivateNewAccountPanel, UseActivateNewAccountPanelProps } from '../components/ActivateAccountPanel'
import { UsePageHeaderProps } from '../components/PageHeader'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'
export * from '../components/ActivateAccountPanel'

export type ActivateNewAccountPageProps = {
  useActivateNewAccountPanelProps: UseActivateNewAccountPanelProps
  usePageHeaderProps: UsePageHeaderProps
}

export const ActivateNewAccountPage: FC<ActivateNewAccountPageProps> = ({
  usePageHeaderProps,
  useActivateNewAccountPanelProps,
}) => {
  return (
    <HeaderPageTemplate useProps={usePageHeaderProps}>
      <ActivateNewAccountPanel useProps={useActivateNewAccountPanelProps} />
    </HeaderPageTemplate>
  )
}

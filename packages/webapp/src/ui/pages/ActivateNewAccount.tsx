import { FC, ReactElement } from 'react'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'
export * from '../components/ActivateAccountPanel'

export type ActivateNewAccountPageProps = {
  ActivateNewAccountPanel: ReactElement
}

export const ActivateNewAccountPage: FC<ActivateNewAccountPageProps> = ({ ActivateNewAccountPanel }) => {
  return <HeaderPageTemplate>{ActivateNewAccountPanel}</HeaderPageTemplate>
}

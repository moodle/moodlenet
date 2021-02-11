import { FC, ReactElement } from 'react'
import { EmptyPageTemplate } from '../templates/page/EmptyPageTemplate'
export * from '../components/ActivateAccountPanel'

export type ActivateNewAccountPageProps = {
  ActivateNewAccountPanel: ReactElement
}

export const ActivateNewAccountPage: FC<ActivateNewAccountPageProps> = ({ ActivateNewAccountPanel }) => {
  return <EmptyPageTemplate>{ActivateNewAccountPanel}</EmptyPageTemplate>
}

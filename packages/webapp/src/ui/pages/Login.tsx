import { FC, ReactElement } from 'react'
import { EmptyPageTemplate } from '../templates/page/EmptyPageTemplate'
export * from '../components/LoginPanelBig'

export type LoginPageProps = {
  LoginPanel: ReactElement
}

export const LoginPage: FC<LoginPageProps> = ({ LoginPanel }) => {
  return <EmptyPageTemplate>{LoginPanel}</EmptyPageTemplate>
}

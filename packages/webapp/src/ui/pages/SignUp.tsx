import { FC, ReactElement } from 'react'
import { EmptyPageTemplate } from '../templates/page/EmptyPageTemplate'
export * from '../components/SignupPanelBig'

export type SignupPageProps = {
  SignupPanel: ReactElement
}

export const SignUpPage: FC<SignupPageProps> = ({ SignupPanel }) => {
  return <EmptyPageTemplate>{SignupPanel}</EmptyPageTemplate>
}

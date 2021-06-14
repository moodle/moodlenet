import { FC } from 'react'
import { LoginPanelBig, LoginPanelProps } from '../components/LoginPanelBig'
import { EmptyPageTemplate } from '../templates/page/EmptyPageTemplate'
export * from '../components/LoginPanelBig'

export type LoginPageProps = {
  loginPanelProps: LoginPanelProps
}

export const LoginPage: FC<LoginPageProps> = ({ loginPanelProps }) => {
  return (
    <EmptyPageTemplate>
      <LoginPanelBig {...loginPanelProps} />
    </EmptyPageTemplate>
  )
}

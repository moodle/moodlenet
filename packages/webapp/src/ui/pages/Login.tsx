import { FC } from 'react'
import { LoginPanelBig, UseLoginPanelProps } from '../components/LoginPanelBig'
import { EmptyPageTemplate } from '../templates/page/EmptyPageTemplate'
export * from '../components/LoginPanelBig'

export type LoginPageProps = {
  useLoginPanelProps: UseLoginPanelProps
}

export const LoginPage: FC<LoginPageProps> = ({ useLoginPanelProps }) => {
  return (
    <EmptyPageTemplate>
      <LoginPanelBig useProps={useLoginPanelProps} />
    </EmptyPageTemplate>
  )
}

import { FC } from 'react'
import { SignupPanelBig, SignupPanelProps } from '../components/SignupPanelBig'
import { EmptyPageTemplate } from '../templates/page/EmptyPageTemplate'
export * from '../components/SignupPanelBig'

export type SignupPageProps = {
  signupPanelProps: SignupPanelProps
}

export const SignUpPage: FC<SignupPageProps> = ({ signupPanelProps }) => {
  return (
    <EmptyPageTemplate>
      <SignupPanelBig {...signupPanelProps} />
    </EmptyPageTemplate>
  )
}

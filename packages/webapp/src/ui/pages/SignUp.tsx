import { FC } from 'react'
import { SignupPanelBig, UseSignupPanelProps } from '../components/SignupPanelBig'
import { EmptyPageTemplate } from '../templates/page/EmptyPageTemplate'
export * from '../components/SignupPanelBig'

export type SignupPageProps = {
  useSignupPanelProps: UseSignupPanelProps
}

export const SignUpPage: FC<SignupPageProps> = ({ useSignupPanelProps }) => {
  return (
    <EmptyPageTemplate>
      <SignupPanelBig useProps={useSignupPanelProps} />
    </EmptyPageTemplate>
  )
}

import { FC, ReactElement } from 'react'
import { EmptyPageTemplate } from '../../templates/page/EmptyPageTemplate'
export * from '../../components/ActivateAccountPanel'

export type LoginPageProps = {
  ActivateNewAccountPanel: ReactElement
}

export const ActivateNewAccountPage: FC<LoginPageProps> = ({ ActivateNewAccountPanel }) => {
  return (
    <EmptyPageTemplate>
      <div>{ActivateNewAccountPanel}</div>
    </EmptyPageTemplate>
  )
}

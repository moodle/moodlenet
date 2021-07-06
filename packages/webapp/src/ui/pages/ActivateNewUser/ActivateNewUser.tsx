import { FC } from 'react'
import { CtrlBag } from '../../lib/ctrl'
import { EmptyPageTemplate } from '../../templates/page/EmptyPageTemplate'
import { ActivateNewUserPanel, ActivateNewUserPanelProps } from './ActivateUserPanel/ActivateUserPanel'
export * from './ActivateUserPanel/ActivateUserPanel'

export type ActivateNewUserPageProps = {
  ActivateNewUserPanelCtrl: CtrlBag<ActivateNewUserPanelProps, 'mycss'>
}

export const ActivateNewUserPage: FC<ActivateNewUserPageProps> = ({ ActivateNewUserPanelCtrl }) => {
  return (
    <EmptyPageTemplate>
      <ActivateNewUserPanelCtrl.Cmp _={ActivateNewUserPanel} {...ActivateNewUserPanelCtrl} mycss={'blue'} />
    </EmptyPageTemplate>
  )
}

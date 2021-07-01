import { FC } from 'react'
import { ActivateNewUserPanel, ActivateNewUserPanelProps } from '../../components/ActivateUserPanel/ActivateUserPanel'
import { CtrlBag } from '../../lib/ctrl'
import { EmptyPageTemplate } from '../../templates/page/EmptyPageTemplate'
export * from '../../components/ActivateUserPanel/ActivateUserPanel'

export type ActivateNewUserPageProps = {
  ActivateNewUserPanelCtrl: CtrlBag<ActivateNewUserPanelProps, 'uiProp'>
}

export const ActivateNewUserPage: FC<ActivateNewUserPageProps> = ({ ActivateNewUserPanelCtrl }) => {
  return (
    <EmptyPageTemplate>
      <ActivateNewUserPanelCtrl.Cmp {...ActivateNewUserPanelCtrl} _={ActivateNewUserPanel} uiProp={'blue'} />
    </EmptyPageTemplate>
  )
}

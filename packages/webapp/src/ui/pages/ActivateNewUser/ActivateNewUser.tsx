import { FC } from 'react'
import { WithPropsList } from '../../lib/ctrl'
import { EmptyPageTemplate } from '../../templates/page/EmptyPageTemplate'
import { ActivateNewUserPanel, ActivateNewUserPanelProps } from './ActivateUserPanel/ActivateUserPanel'
export * from './ActivateUserPanel/ActivateUserPanel'

export type ActivateNewUserPageProps = {
  withNewUserPanelWithProps: WithPropsList<ActivateNewUserPanelProps, 'mycss'>
}

export const ActivateNewUserPage: FC<ActivateNewUserPageProps> = ({ withNewUserPanelWithProps }) => {
  const [ActivateNewUserPanelWithProps, activateNewUserPanelCtrlPropsList] = withNewUserPanelWithProps(
    ActivateNewUserPanel,
  )

  return (
    <EmptyPageTemplate>
      {activateNewUserPanelCtrlPropsList.map(activateNewUserPanelCtrlProps => (
        <div key={activateNewUserPanelCtrlProps.__key}>
          <ActivateNewUserPanelWithProps {...activateNewUserPanelCtrlProps} mycss={'blue'} />
        </div>
      ))}
    </EmptyPageTemplate>
  )
}

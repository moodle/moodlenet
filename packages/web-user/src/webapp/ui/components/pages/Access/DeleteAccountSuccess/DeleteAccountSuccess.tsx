import { Card } from '@moodlenet/component-library'
import type { MainFooterProps, MinimalisticHeaderProps } from '@moodlenet/react-app/ui'
import { SimpleLayout } from '@moodlenet/react-app/ui'
import type { ComponentType, FC } from 'react'
import './DeleteAccountSuccess.scss'

export type DeleteAccountSuccessFormValues = { name: string; email: string; password: string }
export type DeleteAccountSuccessItem = { Icon: ComponentType; Panel: ComponentType; key: string }
export type DeleteAccountSuccessProps = {
  headerProps: MinimalisticHeaderProps
  footerProps: MainFooterProps
}

export const DeleteAccountSuccess: FC<DeleteAccountSuccessProps> = ({
  headerProps,
  footerProps,
}) => {
  return (
    <SimpleLayout footerProps={footerProps} headerProps={headerProps}>
      <div className="delete-account-success">
        <div className="success-content">
          <Card>
            <div className="content">
              <div className="emoji">👋</div>
              <div className="title">Account deleted successfully</div>
              <div className="subtitle">
                We confirm that your account with your personal details have been completely deleted
                from our servers
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SimpleLayout>
  )
}

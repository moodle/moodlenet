import { Trans } from '@lingui/macro'
import { Href, Link } from '../../../../elements/link'
import { CP, withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import {
  MainPageWrapper,
  MainPageWrapperProps,
} from '../../../templates/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type ActivationFormValues = { name: string; password: string }
export type ActivationProps = {
  mainPageWrapperProps: CP<MainPageWrapperProps>
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  loginHref: Href
}

export const Activation = withCtrl<ActivationProps>(
  ({ mainPageWrapperProps, accessHeaderProps, loginHref }) => {
    return (
      <MainPageWrapper {...mainPageWrapperProps}>
        <div className="activation-page">
          <AccessHeader {...accessHeaderProps} page={'activation'} />
          <div className="main-content">
            <Card>
              <div className="content">
                <div className="title">
                  <Trans>Account activated!</Trans>
                </div>
                <div className="bottom">
                  <Link href={loginHref}>
                    <PrimaryButton>
                      <Trans>Log in</Trans>
                    </PrimaryButton>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </MainPageWrapper>
    )
  }
)
Activation.displayName = 'SignUpPage'

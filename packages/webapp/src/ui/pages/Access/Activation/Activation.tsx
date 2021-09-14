import { Trans } from '@lingui/macro'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import { Href, Link } from '../../../elements/link'
import { CP, withCtrl } from '../../../lib/ctrl'
import { MainPageWrapper } from '../../../templates/page/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type ActivationFormValues = { name: string; password: string }
export type ActivationProps = {
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  loginHref: Href
}

export const Activation = withCtrl<ActivationProps>(({ accessHeaderProps, loginHref }) => {
  return (
    <MainPageWrapper>
      <div className="activation-page">
        <AccessHeader {...accessHeaderProps} page={'activation'} />
        <div className="separator" />
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
})
Activation.displayName = 'SignUpPage'

import { t, Trans } from '@lingui/macro'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { MainPageWrapper } from '../../../templates/page/MainPageWrapper'
import { useTitle } from '../../commons'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type ActivationFormValues = { name: string; password: string }
export type ActivationProps = {
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  formBag: FormikBag<ActivationFormValues>
  activationErrorMessage: string | null
  accountActivated: boolean
}

export const Activation = withCtrl<ActivationProps>(({ accessHeaderProps, formBag, accountActivated }) => {
  useTitle('Account activation | MoodleNet')
  const [form, attrs] = formBag
  return (
    <MainPageWrapper>
      <div className="activation-page">
        <AccessHeader {...accessHeaderProps} page={'activation'} />
        <div className="separator" />
        <div className="main-content">
          <Card style={accountActivated ? {} : { visibility: 'hidden' }}>
            <Trans>Account activated!</Trans>
          </Card>
          <Card>
            <div className="content">
              <div className="title">
                <Trans>User details</Trans>
              </div>
              <form>
                <input
                  className="diplay-name"
                  type="text"
                  disabled={accountActivated}
                  placeholder={t`Display name`}
                  {...attrs.name}
                  onChange={form.handleChange}
                />
                <input
                  className="password"
                  type="password"
                  disabled={accountActivated}
                  placeholder={t`Password`}
                  {...attrs.password}
                  onChange={form.handleChange}
                />
              </form>
              <div className="bottom">
                <div className="left">
                  <PrimaryButton onClick={form.submitForm}>
                    <Trans>Create account</Trans>
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainPageWrapper>
  )
})
Activation.displayName = 'SignUpPage'

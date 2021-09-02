import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
import HeaderTitle from '../../../components/Header/HeaderTitle/HeaderTitle'
import { Href, Link } from '../../../elements/link'
import { withCtrl } from '../../../lib/ctrl'
import { Organization } from '../../../types'
import './styles.scss'

export type AccessHeaderProps = {
  organization: Pick<Organization, 'logo' | 'name' | 'url'>
  homeHref: Href
  signupHref: Href
  loginHref: Href
  page: 'login' | 'signup' | 'activation'
  termsAndConditionsHref: Href
}

export const AccessHeader = withCtrl<AccessHeaderProps, 'page'>(
  ({ organization, homeHref, signupHref, loginHref, page, termsAndConditionsHref }) => {
    return (
      <div className="access-header">
        <div className="content">
          <HeaderTitle organization={organization} homeHref={homeHref} />
          {page !== 'activation' ? (
            <div className="buttons">
              {page === 'login' ? (
                <Link href={signupHref}> {/* TODO Implement on Controller */}
                  <SecondaryButton color="orange">Sign up</SecondaryButton>
                </Link>
              ) : (
                <Link href={loginHref}> {/* TODO Implement on Controller */}
                  <SecondaryButton color="orange">Login</SecondaryButton>
                </Link>
              )}
              <PrimaryButton>
                <Link href={termsAndConditionsHref} target="__blank">
                  Learn more
                </Link>
              </PrimaryButton>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  },
)
AccessHeader.displayName = 'AccessHeader'
export default AccessHeader

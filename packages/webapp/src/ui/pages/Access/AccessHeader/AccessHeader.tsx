import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
import HeaderTitle from '../../../components/Header/HeaderTitle/HeaderTitle'
import { Href } from '../../../elements/link'
import { withCtrl } from '../../../lib/ctrl'
import { Organization } from '../../../types'
import './styles.scss'

export type AccessHeaderProps = {
  organization: Pick<Organization, 'logo' | 'name' | 'url'>
  homeHref: Href
  page: 'login' | 'signup' | 'activation'
}

export const AccessHeader = withCtrl<AccessHeaderProps, 'page'>(({ organization, homeHref, page }) => {
  return (
    <div className="access-header">
      <div className="content">
        <HeaderTitle organization={organization} homeHref={homeHref} />
        {page !== 'activation' ? (
          <div className="buttons">
            {page === 'login' ? (
              <SecondaryButton type="orange">Sign up</SecondaryButton>
            ) : (
              <SecondaryButton type="orange">Login</SecondaryButton>
            )}
            <PrimaryButton>Learn more</PrimaryButton>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
})
AccessHeader.displayName = 'AccessHeader'
export default AccessHeader

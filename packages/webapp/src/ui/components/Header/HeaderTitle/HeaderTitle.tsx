import { FC } from 'react'
import { Href, Link } from '../../../elements/link'
import smallLogo from '../../../static/img/moodlenet-logo-small.svg'
import Logo from '../../../static/img/moodlenet-logo.svg'
import { Organization } from '../../../types'
import './styles.scss'

export type HeaderTitleProps = {
  organization: Pick<Organization, 'logo' | 'name' | 'url'>
  homeHref: Href
}

export const HeaderTitle: FC<HeaderTitleProps> = ({ organization, homeHref }) => {
  return (
    <Link href={homeHref} style={{ textDecoration: 'none' }}>
      {!organization.logo ? (
        <div className="header-title">
          <img className="logo big" src={Logo} alt="Logo" />
          <img className="logo small" src={smallLogo} alt="small Logo" />
        </div>
      ) : (
        <div className="header-title">
          <img className="logo" src={organization.logo} alt="Logo" />
          <div className="text big">MoodleNet</div>
        </div>
      )}
    </Link>
  )
}

export default HeaderTitle

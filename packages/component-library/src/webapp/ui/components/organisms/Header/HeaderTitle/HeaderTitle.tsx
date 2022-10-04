import { FC } from 'react'
import { Link } from 'react-router-dom'
import smallLogo from '../../../../assets/logos/moodlenet-logo-small.png'
import logo from '../../../../assets/logos/moodlenet-logo.png'
import './HeaderTitle.scss'

export type HeaderTitleProps = {
  // organization: Pick<Organization, 'logo' | 'url' | 'smallLogo'>
  // logo: string
  // smallLogo: string
  // homeHref: Href
}

export const HeaderTitle: FC<HeaderTitleProps> = (
  {
    // logo,
    // smallLogo,
    // organization,
    // homeHref,
  },
) => {
  return (
    <Link /* href={homeHref} */ to="/" style={{ textDecoration: 'none' }}>
      <div className="header-title">
        <img className="logo big" src={logo} alt="Logo" />
        <img className="logo small" src={smallLogo} alt="small Logo" />
      </div>
    </Link>
  )
}

export default HeaderTitle

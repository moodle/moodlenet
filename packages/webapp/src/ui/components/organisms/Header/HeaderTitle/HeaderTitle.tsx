import { FC } from 'react'
import { Href, Link } from '../../../../elements/link'
import { Organization } from '../../../../types'
import './styles.scss'

export type HeaderTitleProps = {
  organization: Pick<Organization, 'logo' | 'url' | 'smallLogo'>
  homeHref: Href
}

export const HeaderTitle: FC<HeaderTitleProps> = ({
  organization,
  homeHref,
}) => {
  return (
    <Link href={homeHref} style={{ textDecoration: 'none' }}>
      <div className="header-title">
        <img className="logo big" src={organization.logo} alt="Logo" />
        <img
          className="logo small"
          src={organization.smallLogo}
          alt="small Logo"
        />
      </div>
    </Link>
  )
}

export default HeaderTitle

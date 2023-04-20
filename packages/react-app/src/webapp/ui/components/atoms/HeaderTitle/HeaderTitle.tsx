import { FC } from 'react'
import { Href } from '../../../../../common/lib.mjs'
import { Link } from '../../elements/link.js'

import './HeaderTitle.scss'

export type HeaderTitleProps = {
  logo: string
  smallLogo: string
  url: Href
}

export const HeaderTitle: FC<HeaderTitleProps> = ({ logo, smallLogo, url }) => {
  return (
    <Link href={url} style={{ textDecoration: 'none' }}>
      <div className="header-title">
        <img className="logo big" src={logo} alt="Logo" />
        <img className="logo small" src={smallLogo} alt="small Logo" />
      </div>
    </Link>
  )
}

export default HeaderTitle

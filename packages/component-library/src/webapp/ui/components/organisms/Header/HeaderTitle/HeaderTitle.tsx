import { FC } from 'react'
import { Link } from 'react-router-dom'
import './HeaderTitle.scss'

export type HeaderTitleProps = {
  logo: string
  smallLogo: string
  url: string
}

export const HeaderTitle: FC<HeaderTitleProps> = (
  {
    logo,
    smallLogo,
    url,
  },
) => {
  return (
    <Link to={url} style={{ textDecoration: 'none' }}>
      <div className="header-title">
        <img className="logo big" src={logo} alt="Logo" />
        <img className="logo small" src={smallLogo} alt="small Logo" />
      </div>
    </Link>
  )
}

export default HeaderTitle
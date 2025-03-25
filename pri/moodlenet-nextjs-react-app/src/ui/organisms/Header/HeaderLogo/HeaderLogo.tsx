'use client'
import Link from 'next/link'
import { appRoute } from '../../../../lib/common/appRoutes'
import defaultLogoSmall from '../../../../ui/lib/assets/logos/moodlenet-logo-small.svg'
import defaultLogo from '../../../../ui/lib/assets/logos/moodlenet-logo.svg'
import './HeaderLogo.scss'

export interface HeaderLogoProps {
  logo?: string | undefined
  smallLogo?: string | undefined
  landingPath: appRoute
}

export default function HeaderLogo({ smallLogo = defaultLogoSmall, logo = defaultLogo, landingPath }: HeaderLogoProps) {
  return (
    <Link href={landingPath} style={{ textDecoration: 'none' }}>
      <div className="header-title">
        <img className="logo big" src={logo} alt="Logo" />
        <img className="logo small" src={smallLogo} alt="small Logo" />
      </div>
    </Link>
  )
}

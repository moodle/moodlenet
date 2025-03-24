'use client'
import { nullish } from '@moodle/lib-types'
import Link from 'next/link'
import { appRoute } from '../../../../lib/common/appRoutes'
import './HeaderLogo.scss'

export interface HeaderLogoProps {
  logo: string | nullish
  smallLogo: string | nullish
  landingPath: appRoute
}

export default function HeaderLogo({ logo, smallLogo, landingPath }: HeaderLogoProps) {
  return (
    <Link href={landingPath} style={{ textDecoration: 'none' }}>
      <div className="header-title">
        <img className="logo big" src={logo} alt="Logo" />
        <img className="logo small" src={smallLogo} alt="small Logo" />
      </div>
    </Link>
  )
}

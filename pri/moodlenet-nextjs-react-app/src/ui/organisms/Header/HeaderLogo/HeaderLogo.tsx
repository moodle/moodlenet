'use client'
import Link from 'next/link'
import './HeaderLogo.scss'
import { asset } from '@moodle/module/storage'
import { useAssetUrl } from '../../../../lib/client/globalContexts'
import { appRoute } from '../../../../lib/common/appRoutes'

export interface HeaderLogoProps {
  logo: asset
  smallLogo: asset
  landingPath: appRoute
}

export default function HeaderLogo({ logo, smallLogo, landingPath }: HeaderLogoProps) {
  const [logoUrl] = useAssetUrl(logo)
  const [smallLogoUrl] = useAssetUrl(smallLogo)
  return (
    <Link href={landingPath} style={{ textDecoration: 'none' }}>
      <div className="header-title">
        <img className="logo big" src={logoUrl} alt="Logo" />
        <img className="logo small" src={smallLogoUrl} alt="small Logo" />
      </div>
    </Link>
  )
}

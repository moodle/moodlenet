'use client'
import Link from 'next/link'
import './HeaderLogo.scss'
import { asset } from '@moodle/module/storage'
import { useAssetUrl } from '../../../../lib/client/globalContexts'

export interface HeaderLogoProps {
  logo: asset
  smallLogo: asset
  landingPath: string
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

'use client'
import Link from 'next/link'
import './HeaderLogo.scss'

export interface HeaderLogoProps {
  logo: string
  smallLogo: string
  href: string
}

export default function HeaderLogo({ logo, smallLogo, href }: HeaderLogoProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div className="header-title">
        <img className="logo big" src={logo} alt="Logo" />
        <img className="logo small" src={smallLogo} alt="small Logo" />
      </div>
    </Link>
  )
}

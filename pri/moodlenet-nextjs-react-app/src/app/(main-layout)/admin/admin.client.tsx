'use client'

import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sitepaths } from '../../../lib/common/sitepaths'
import { Card } from '../../../ui/atoms/Card/Card'

export function AdminMenu() {
  const { t } = useTranslation()

  return (
    <Card role="navigation" className="menu">
      <MenuItem pathname={sitepaths.admin.general()} title={t('General')} />
      <MenuItem pathname={'#' /* sitepaths.admin.appearance() */} title={t('Appearance')} />
      <MenuItem pathname={sitepaths.admin.users()} title={t('Users')} />
      <MenuItem pathname={'#' /* sitepaths.admin.moderation() */} title={t('Moderation')} />
    </Card>
  )
}

export function MenuItem({ pathname, title }: { pathname: string; title: string }) {
  const isCurrent = pathname === usePathname()
  return (
    <Link href={pathname}>
      <div className={`section ${isCurrent ? 'selected' : ''}`}>
        <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
          <div className={`border ${isCurrent ? 'selected' : ''}`} />
        </div>
        <div className={`content ${isCurrent ? 'selected' : ''}`}>
          <abbr title={title}>{title}</abbr>
        </div>
      </div>
    </Link>
  )
}

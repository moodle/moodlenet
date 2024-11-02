'use client'

import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { appRoute, appRoutes } from '../../../lib/common/appRoutes'
import { Card } from '../../../ui/atoms/Card/Card'

export function SettingsMenu() {
  const { t } = useTranslation()

  return (
    <Card role="navigation" className="menu">
      <MenuItem pathname={appRoutes('/settings/general')} title={t('General')} />
      <MenuItem pathname={appRoutes('/settings/advanced')} title={t('Advanced')} />
    </Card>
  )
}

export function MenuItem({ pathname, title }: { pathname: appRoute; title: string }) {
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

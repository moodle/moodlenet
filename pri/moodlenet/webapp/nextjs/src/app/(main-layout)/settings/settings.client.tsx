'use client'

import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { sitepaths } from '../../../lib/common/utils/sitepaths'
import { Trans, useTranslation } from 'next-i18next'
import { Card } from '../../../ui/atoms/Card/Card'
import { usePathname } from 'next/navigation'

export default function SettingsMenu() {
  const settingsPath = sitepaths().pages.user.settings
  const { t } = useTranslation()

  return (
    <Card role="navigation" className="menu">
      <MenuItem pathname={settingsPath('/general')} title={t('General')} />
      <MenuItem pathname={settingsPath('/advanced')} title={t('Advanced')} />
    </Card>
  )
}

export function MenuItem({
  children,
  pathname,
  title,
}: PropsWithChildren<{ pathname: string; title: string }>) {
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

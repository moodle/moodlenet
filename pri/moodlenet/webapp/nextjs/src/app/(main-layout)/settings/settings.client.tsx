'use client'

import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { sitepaths } from '../../../lib/common/utils/sitepaths'
import { Trans, useTranslation } from 'react-i18next'
import { Card } from '../../../ui/atoms/Card/Card'
import { usePathname } from 'next/navigation'

export default function SettingsMenu() {
  // const isCurrent = JSON.stringify(settingsItem) === JSON.stringify(currSettingsItem)
  // const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsItem)
  const {
    pages: {
      user: { settings },
    },
  } = sitepaths()
  const { t } = useTranslation()

  return (
    <Card role="navigation" className="menu">
      <MenuItem pathname={settings('/general')} title={t('General')}>
        <Trans>General</Trans>
      </MenuItem>
      <MenuItem pathname={settings('/advanced')} title={t('Advanced')}>
        <Trans>Advanced</Trans>
      </MenuItem>
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
          <abbr title={title}>{children}</abbr>
        </div>
      </div>
    </Link>
  )
}

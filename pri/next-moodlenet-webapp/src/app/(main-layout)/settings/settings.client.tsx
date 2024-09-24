'use client'

import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { sitepaths } from '../../../lib/common/utils/sitepaths'
import { Card } from '../../../ui/atoms/Card/Card'

export function SettingsMenu() {
  const settingsPath = sitepaths().pages.user.settings
  const { t } = useTranslation()

  return (
    <Card role="navigation" className="menu">
      <MenuItem pathname={settingsPath('/general')} title={t('General')} />
      <MenuItem pathname={settingsPath('/advanced')} title={t('Advanced')} />
    </Card>
  )
}

// export function NoAccess() {
//   return (
//     <div>
//       <Trans>Please login</Trans>
//     </div>
//   )
// }
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

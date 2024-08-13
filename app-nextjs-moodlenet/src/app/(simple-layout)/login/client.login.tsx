'use client'

import Card from '@/ui/atoms/Card/Card'
import { ReactNodeSer } from '@/lib/server/session/types/website/layouts'
import CallMadeIcon from '@mui/icons-material/CallMade'
import { siteUrls } from '@/lib/common/utils/site-urls'
import Link from 'next/link'
import { useState, type CSSProperties } from 'react'
import { Trans } from 'react-i18next'

export interface LoginCardProps {
  loginMethods: {
    label: ReactNodeSer
    panel: ReactNodeSer
    key: string
  }[]
}

export function LoginCard({ loginMethods }: LoginCardProps) {
  const [currKey, setCurrKey] = useState(loginMethods[0]?.key ?? '')
  const currentPanel = loginMethods.find(({ key }) => key === currKey)?.panel
  const hrefs = siteUrls()
  return (
    <>
      <Card className="login-card">
        <div className="content">
          <div className="title">
            <Trans>Log in</Trans>
          </div>
          {!loginMethods.length && (
            <div>
              <Trans>No authentication methods available</Trans>
            </div>
          )}
          {currentPanel}
          {loginMethods.map(({ label, key, panel }) => {
            const isCurrent = key === currKey
            const css: CSSProperties = {
              float: 'left',
              cursor: isCurrent ? undefined : 'pointer',
              fontWeight: isCurrent ? 'bold' : undefined,
              display: isCurrent ? 'none' : 'block',
            }
            const onClick = isCurrent ? undefined : () => setCurrKey(key)

            return (
              <div key={key} style={css} onClick={onClick}>
                {label}
              </div>
            )
          })}
        </div>
      </Card>
      <Card hover={true}>
        <Link href={hrefs.access.signup}>
          <Trans>Sign up</Trans>
          <CallMadeIcon />
        </Link>
      </Card>
    </>
  )
}

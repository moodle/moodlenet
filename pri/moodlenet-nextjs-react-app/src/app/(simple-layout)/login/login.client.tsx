'use client'

import CallMadeIcon from '@mui/icons-material/CallMade'
import { Trans } from 'next-i18next'
import Link from 'next/link'
import { useState, type CSSProperties } from 'react'
import { clientSlotItem } from '../../../lib/common/types'
import { appRoutes } from '../../../lib/common/appRoutes'
import { Card } from '../../../ui/atoms/Card/Card'

export interface LoginMethod {
  label: clientSlotItem
  panel: clientSlotItem
  key: string
}

export interface LoginCardProps {
  loginMethods: LoginMethod[]
}

export function LoginCard({ loginMethods }: LoginCardProps) {
  const [currMethod, setCurrMethod] = useState(loginMethods[0])
  return (
    <>
      <Card className="login-card">
        <div className="content">
          <div className="title">
            <Trans>Log in</Trans>
          </div>
          {!currMethod ? (
            <div>
              <Trans>No authentication methods available</Trans>
            </div>
          ) : (
            <>
              {currMethod?.panel}
              {loginMethods.length > 1 && (
                <>
                  <div>
                    <Trans>Log in with</Trans>
                  </div>
                  {loginMethods.map(meth => {
                    const { label, key } = meth
                    const isCurrent = meth === currMethod
                    const css: CSSProperties = {
                      float: 'left',
                      cursor: isCurrent ? undefined : 'pointer',
                      fontWeight: isCurrent ? 'bold' : undefined,
                      // display: isCurrent ? 'none' : 'block',
                    }
                    const onClick = isCurrent ? undefined : () => setCurrMethod(meth)

                    return (
                      <div key={key} style={css} onClick={onClick}>
                        {label}
                      </div>
                    )
                  })}
                </>
              )}
            </>
          )}
        </div>
      </Card>
      <Card hover={true}>
        <Link href={appRoutes('/signup')}>
          <Trans>Sign up</Trans>
          <CallMadeIcon />
        </Link>
      </Card>
    </>
  )
}

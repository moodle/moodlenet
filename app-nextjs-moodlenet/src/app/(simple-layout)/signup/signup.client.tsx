'use client'

import { clientSlotItem } from '@/lib/common/pages'
import { sitepaths } from '@/lib/common/utils/sitepaths'
import Card from '@/ui/atoms/Card/Card'
import CallMadeIcon from '@mui/icons-material/CallMade'
import Link from 'next/link'
import { useState, type CSSProperties } from 'react'
import { Trans } from 'react-i18next'

export interface SignupMethod {
  label: clientSlotItem
  panel: clientSlotItem
  key: string
}

export interface SignupCardProps {
  signupMethods: SignupMethod[]
  slots: Record<'subCard', clientSlotItem[]>
}

export function SignupCard({ signupMethods, slots }: SignupCardProps) {
  const [currMethod, setCurrMethod] = useState(signupMethods[0])
  const hrefs = sitepaths()
  return (
    <>
      <Card className="login-card" hover={true}>
        <Link href={hrefs.access.login}>
          <Trans>Log in</Trans>
          <CallMadeIcon />
        </Link>
      </Card>
      <Card className="signup-card">
        <div className="content">
          <div className="title">
            <Trans>Sign up</Trans>
          </div>
          {!currMethod ? (
            <div>
              <Trans>No sign up methods available</Trans>
            </div>
          ) : (
            <>
              {currMethod?.panel}
              <div>
                <Trans>Sighn up with</Trans>
              </div>
              {signupMethods.map(meth => {
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
              {slots.subCard}
            </>
          )}
        </div>
      </Card>
    </>
  )
}

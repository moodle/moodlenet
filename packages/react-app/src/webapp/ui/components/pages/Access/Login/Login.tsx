import { CallMade as CallMadeIcon } from '@material-ui/icons'
import { Card } from '@moodlenet/component-library'
import { CSSProperties, FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { registries } from '../../../../../web-lib.mjs'
// import { Link } from '../../../../elements/link'
import SimpleLayout from '../../../layout/SimpleLayout/SimpleLayout.js'
import './Login.scss'

export type LoginProps = Record<string, unknown>

export const Login: FC<LoginProps> = () => {
  return (
    <SimpleLayout page="login" style={{ height: '100%' }} contentStyle={{ padding: '0' }}>
      <LoginBody />
    </SimpleLayout>
  )
}
export const LoginBody: FC<LoginProps> = () => {
  const { registry: loginRegs } = registries.loginItems.useRegistry()
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (e.key === 'Enter') {
  //     // form.submitForm()
  //   }
  // }

  // const shouldShowErrors = !!form.submitCount && (wrongCreds || !form.isValid)

  const defaultLoginEntry = loginRegs.entries[0]
  const [currLoginEntry, chooseLoginEntry] = useState(defaultLoginEntry)
  useEffect(() => chooseLoginEntry(defaultLoginEntry), [defaultLoginEntry])
  return (
    <div className="login-page">
      <div className="content">
        <Card className="login-card">
          <div className="content">
            <div className="title">Log in</div>
            {currLoginEntry ? <currLoginEntry.item.Panel /> : <div>No Auth available</div>}
            {loginRegs.entries.length > 1 && (
              <>
                {/* <span style={{ float: 'left', marginRight: '10px' }}>use:</span> */}
                {loginRegs.entries.map((entry, index) => {
                  const isCurrent = entry === currLoginEntry
                  const css: CSSProperties = {
                    float: 'left',
                    cursor: isCurrent ? undefined : 'pointer',
                    fontWeight: isCurrent ? 'bold' : undefined,
                    display: isCurrent ? 'none' : 'block',
                  }
                  const onClick = isCurrent ? undefined : () => chooseLoginEntry(entry)

                  return (
                    <div key={index} style={css} onClick={onClick}>
                      <entry.item.Icon />
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </Card>
        <Card hover={true}>
          <Link to={`/signup`}>
            Sign up
            <CallMadeIcon />
          </Link>
        </Card>
      </div>
    </div>
  )
}

Login.displayName = 'LoginPage'

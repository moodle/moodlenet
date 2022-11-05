import { CallMade as CallMadeIcon } from '@material-ui/icons'
import { Card, MinimalisticHeaderProps } from '@moodlenet/component-library'
import { CSSProperties, FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoginItem } from '../../../../../web-lib.mjs'
// import { Link } from '../../../../elements/link'
import SimpleLayout from '../../../layout/SimpleLayout/SimpleLayout.js'
import './Login.scss'

export type LoginProps = {
  loginItems: LoginItem[]
  headerProps: MinimalisticHeaderProps
}
// Record<string, unknown>

export const LoginPage: FC<LoginProps> = ({ loginItems, headerProps }) => {
  // TODO: I commenti sotto implementarli nel hook

  // const { registry: loginRegs } = registries.loginItems.useRegistry()
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (e.key === 'Enter') {
  //     // form.submitForm()
  //   }
  // }

  // const shouldShowErrors = !!form.submitCount && (wrongCreds || !form.isValid)

  // const defaultLoginEntry = loginRegs.entries[0]
  const defaultLoginEntry = loginItems[0]
  const [currLoginEntry, chooseLoginEntry] = useState(defaultLoginEntry)
  useEffect(() => chooseLoginEntry(defaultLoginEntry), [defaultLoginEntry])
  return (
    <SimpleLayout
      headerProps={headerProps}
      page="login"
      style={{ height: '100%' }}
      contentStyle={{ padding: '0' }}
    >
      <div className="login-page">
        <div className="content">
          <Card className="login-card">
            <div className="content">
              <div className="title">Log in</div>
              {currLoginEntry ? <currLoginEntry.Panel /> : <div>No Auth available</div>}
              {loginItems.length > 1 && (
                // {loginRegs.entries.length > 1 && (
                <>
                  {/* <span style={{ float: 'left', marginRight: '10px' }}>use:</span> */}
                  {loginItems.map((entry, index) => {
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
                        <entry.Icon />
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
    </SimpleLayout>
  )
}

LoginPage.displayName = 'LoginPage'

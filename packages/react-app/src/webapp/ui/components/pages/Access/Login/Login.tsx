import { CallMade as CallMadeIcon } from '@material-ui/icons'
import { Card } from '@moodlenet/component-library'
import { MinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeader.js'
import { ComponentType, CSSProperties, FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import { Link } from '../../../../elements/link'
import SimpleLayout from '../../../layout/SimpleLayout/SimpleLayout.js'
import './Login.scss'

export type LoginItem = { Icon: ComponentType; Panel: ComponentType; key: string }
export type LoginProps = {
  loginItems: LoginItem[]
  headerProps: MinimalisticHeaderProps
}
// Record<string, unknown>

export const LoginPage: FC<LoginProps> = ({ loginItems, headerProps }) => {
  // const shouldShowErrors = !!form.submitCount && (wrongCreds || !form.isValid)
  // const defaultLoginEntry = loginRegs.entries[0]
  const defaultLoginEntry = loginItems[0]
  const [currLoginEntry, chooseLoginEntry] = useState(defaultLoginEntry)
  useEffect(() => chooseLoginEntry(defaultLoginEntry), [defaultLoginEntry])
  return (
    <SimpleLayout
      headerProps={headerProps}
      style={{ height: '100%' }}
      contentStyle={{ padding: '0' }}
    >
      <div className="login-page">
        <div className="content">
          <Card className="login-card">
            <div className="content">
              <div className="title">Log in</div>
              {currLoginEntry ? (
                <currLoginEntry.Panel key={currLoginEntry.key} />
              ) : (
                <div>No Auth available</div>
              )}
              {loginItems.length > 1 && (
                // {loginRegs.entries.length > 1 && (
                <>
                  {/* <span style={{ float: 'left', marginRight: '10px' }}>use:</span> */}
                  {loginItems.map(entry => {
                    const isCurrent = entry === currLoginEntry
                    const css: CSSProperties = {
                      float: 'left',
                      cursor: isCurrent ? undefined : 'pointer',
                      fontWeight: isCurrent ? 'bold' : undefined,
                      display: isCurrent ? 'none' : 'block',
                    }
                    const onClick = isCurrent ? undefined : () => chooseLoginEntry(entry)

                    return (
                      <div key={entry.key} style={css} onClick={onClick}>
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

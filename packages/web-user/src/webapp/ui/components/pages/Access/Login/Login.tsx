import { CallMade as CallMadeIcon } from '@material-ui/icons'
import { Card, Href } from '@moodlenet/component-library'
import { MainFooterProps, MinimalisticHeaderProps, SimpleLayout } from '@moodlenet/react-app/ui'
import { ComponentType, CSSProperties, FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import { Link } from '../../../../elements/link'
import {
  getAccesMinimalisticHeaderItems,
  MinimalisticSlots,
} from '../../../molecules/MinimalisticAccessButtons/MiniAccessButtons.js'
import './Login.scss'

export type LoginItem = { Icon: ComponentType; Panel: ComponentType; key: string }
export type LoginProps = {
  loginItems: LoginItem[]
  headerProps: MinimalisticHeaderProps
  footerProps: MainFooterProps
}
// Record<string, unknown>

export const LoginPage: FC<LoginProps> = ({ loginItems, headerProps, footerProps }) => {
  // const shouldShowErrors = !!form.submitCount && (wrongCreds || !form.isValid)
  // const defaultLoginEntry = loginRegs.entries[0]
  const defaultLoginEntry = loginItems[0]
  const [currLoginEntry, chooseLoginEntry] = useState(defaultLoginEntry)
  useEffect(() => chooseLoginEntry(defaultLoginEntry), [defaultLoginEntry])
  return (
    <SimpleLayout
      footerProps={footerProps}
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

export const getLoginMinimalisticHeaderProps = (
  loginHref: Href,
  signupHref: Href,
): MinimalisticSlots => {
  return getAccesMinimalisticHeaderItems({
    loginHref: loginHref,
    showLearnMoreButton: true,
    showLoginButton: false,
    showSignupButton: true,
    signupHref: signupHref,
  })
}

LoginPage.displayName = 'LoginPage'

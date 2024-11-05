import type { Href } from '@moodlenet/component-library'
import { Card, TertiaryButton } from '@moodlenet/component-library'
import type { MainFooterProps, MinimalisticHeaderProps } from '@moodlenet/react-app/ui'
import { Link, SimpleLayout } from '@moodlenet/react-app/ui'
import { CallMade as CallMadeIcon } from '@mui/icons-material'
import type { ComponentType, CSSProperties, FC, PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import './Signup.scss'

export type SignupFormValues = { name: string; email: string; password: string }
export type SignupItem = {
  Icon: ComponentType
  Panel: ComponentType<PropsWithChildren>
  key: string
}
export type SignupProps = {
  signupItems: SignupItem[]
  headerProps: MinimalisticHeaderProps
  footerProps: MainFooterProps
  loginHref: Href
  userAgreementHref: Href
}

export const Signup: FC<SignupProps> = ({
  headerProps,
  signupItems,
  footerProps,
  loginHref,
  userAgreementHref,
}) => {
  // const shouldShowErrors =
  //   !!form.submitCount && (!!signupErrorMessage || !form.isValid)

  // const { registry: signupRegs } = registries.signupItems.useRegistry()

  // const defaultSignupEntry = signupRegs.entries[0]
  const defaultSignupEntry = signupItems[0]
  const [currSignupEntry, chooseSignupEntry] = useState(defaultSignupEntry)
  useEffect(() => chooseSignupEntry(defaultSignupEntry), [defaultSignupEntry])

  return (
    <SimpleLayout
      footerProps={footerProps}
      headerProps={headerProps}
      style={{ height: '100%' }}
      contentStyle={{ padding: '0' }}
    >
      <div className={`signup-page`}>
        {/* <div className={`signup-page ${requestSent ? 'success' : ''}`} onKeyDown={handleKeyDown}> */}
        <div className={`signup-content`}>
          {/* <div className={`signup-content ${requestSent ? 'success' : ''}`}> */}
          <Card className="login-card" hover={true}>
            <Link href={loginHref}>
              Log in
              <CallMadeIcon />
            </Link>
          </Card>
          <Card className="signup-card">
            <div className="content">
              <div className="title">Sign up</div>
              {currSignupEntry ? (
                <currSignupEntry.Panel key={currSignupEntry.key}>
                  <Link href={userAgreementHref} target="__blank">
                    <TertiaryButton>You agree to our Terms &amp; Conditions</TertiaryButton>
                  </Link>
                </currSignupEntry.Panel>
              ) : (
                <div>No Auth available</div>
              )}
              {/* {currSignupEntry ? <currSignupEntry.item.Panel /> : <div>No Auth available</div>} */}
              {/* {signupRegs.entries.length > 1 && ( */}
              {signupItems.length > 1 && (
                <>
                  <div>
                    {/* <span style={{ float: 'left', marginRight: '10px' }}>use:</span> */}
                    {signupItems.map(signupEntry => {
                      // {signupRegs.entries.map((signupEntry, index) => {
                      const isCurrent = signupEntry === currSignupEntry
                      const css: CSSProperties = {
                        float: 'left',
                        cursor: isCurrent ? undefined : 'pointer',
                        fontWeight: isCurrent ? 'bold' : undefined,
                        display: isCurrent ? 'none' : 'block',
                      }
                      const onClick = isCurrent ? undefined : () => chooseSignupEntry(signupEntry)

                      return (
                        <div key={signupEntry.key} style={css} onClick={onClick}>
                          <signupEntry.Icon />
                          {/* <signupEntry.item.Icon /> */}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
              {/* <div className="bottom">
              <div className="left"> */}
              {/* <Link href={userAgreementHref} target="__blank"> */}
              {/* <a>
                  <TertiaryButton>You agree to our Terms &amp; Conditions</TertiaryButton>
                </a> */}
              {/* </Link> */}
            </div>
            {/* <div className="right" hidden>
                <div className="icon">
                  <img
                    alt="apple Signup"
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                  />
                </div>
                <div className="icon">
                  <img
                    alt="google Signup"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  />
                </div>
              </div> */}
            {/* </div> */}
            {/* </div> */}
          </Card>
        </div>
      </div>
    </SimpleLayout>
  )
}

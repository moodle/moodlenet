import { Card, Href, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import { SimpleLayout, SimpleLayoutProps } from '@moodlenet/react-app/ui'
import { FC, useCallback, useEffect, useState } from 'react'

import {
  getAccesMinimalisticHeaderItems,
  MinimalisticSlots,
} from '../../../molecules/MinimalisticAccessButtons/MinimalisticAccessButtons.js'
import './RootLogin.scss'

export type RootLoginFormValues = { email: string; password: string }

export type RootLoginProps = {
  simpleLayoutProps: SimpleLayoutProps
  submitLogin: (password: string) => void
  loginFailed: boolean
}

export const RootLogin: FC<RootLoginProps> = ({ simpleLayoutProps, loginFailed, submitLogin }) => {
  return (
    <SimpleLayout {...simpleLayoutProps}>
      <RootLoginBody loginFailed={loginFailed} submitLogin={submitLogin} />
    </SimpleLayout>
  )
}
export const RootLoginBody: FC<{
  submitLogin: (password: string) => void
  loginFailed: boolean
}> = ({ loginFailed, submitLogin }) => {
  // const { use } = useContext(MainContext)

  const [submitting, setSubmitting] = useState(false)
  const [rootPassword, setRootPassword] = useState('')
  const rootLogin = useCallback(async () => {
    setSubmitting(true)
    submitLogin(rootPassword)
  }, [rootPassword, submitLogin])

  useEffect(() => {
    if (loginFailed) {
      setSubmitting(false)
    }
  }, [loginFailed])

  return (
    <div className="root-login-page">
      <div className="content">
        <Card>
          <div className="content">
            <div className="title">Root log in</div>
            <form>
              <InputTextField
                className="password"
                placeholder={`Password`}
                type="password"
                name="password"
                edit
                disabled={submitting}
                onChange={({ target: { value } }) => setRootPassword(value)}
              />

              <button type="submit" style={{ display: 'none' }} />
            </form>
            <div className="bottom">
              <div className="content">
                <div className="left">
                  <PrimaryButton disabled={submitting} onClick={rootLogin}>
                    Log in
                  </PrimaryButton>
                  {loginFailed ? <span>Login failed</span> : null}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export const getRootLoginMinimalisticHeaderProps = (
  loginHref: Href,
  signupHref: Href,
): MinimalisticSlots => {
  return getAccesMinimalisticHeaderItems({
    loginHref: loginHref,
    showLearnMoreButton: false,
    showLoginButton: true,
    showSignupButton: true,
    signupHref: signupHref,
  })
}

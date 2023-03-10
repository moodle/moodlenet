import { Card, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import { FC, useCallback, useContext, useState } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { MinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeader.js'

import SimpleLayout from '../../../layout/SimpleLayout/SimpleLayout.js'
import './RootLogin.scss'

export type RootLoginFormValues = { email: string; password: string }

export type RootLoginProps = {
  headerProps: MinimalisticHeaderProps
}

export const RootLogin: FC<RootLoginProps> = ({ headerProps }) => {
  return (
    <SimpleLayout headerProps={headerProps}>
      <RootLoginBody />
    </SimpleLayout>
  )
}
export const RootLoginBody: FC = () => {
  const { use } = useContext(MainContext)

  const [submitting, setSubmitting] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)
  const [rootPassword, setRootPassword] = useState('')
  const rootLogin = useCallback(async () => {
    setLoginFailed(false)
    setSubmitting(true)
    const success = await use.me.rpc.loginAsRoot({ rootPassword })
    setLoginFailed(!success)
    setSubmitting(false)
  }, [use.me, rootPassword])

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

RootLogin.displayName = 'RootLoginPage'

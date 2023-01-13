import { Card, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import { MinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeader.js'
import { FC, useCallback, useContext, useState } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { AuthCtx } from '../../../../../web-lib.mjs'

// import lib from '../../../../../main-lib'

// import { Link } from '../../../../elements/link'
import SimpleLayout from '../../../layout/SimpleLayout/SimpleLayout.js'
import './RootLogin.scss'

// const authSrv = lib.priHttp.fetch<AuthenticationManagerExt>('@moodlenet/authentication-manager@0.1.0')
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
  const { setSessionToken } = useContext(AuthCtx)
  const { use } = useContext(MainContext)

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (e.key === 'Enter') {
  //     // form.submitForm()
  //   }
  // }

  // const shouldShowErrors = !!form.submitCount && (wrongCreds || !form.isValid)
  const [submitting, setSubmitting] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)
  const [rootPassword, setRootPassword] = useState('')
  const rootLogin = useCallback(async () => {
    setLoginFailed(false)
    setSubmitting(true)
    const res = await use.auth.rpc('getRootSessionToken')({ password: rootPassword })
    if (res.success) {
      setSessionToken(res.sessionToken)
    }
    setLoginFailed(!res.success)
    setSubmitting(false)
  }, [use.auth, rootPassword, setSessionToken])

  return (
    <div className="root-login-page">
      <div className="content">
        <Card>
          <div className="content">
            <div className="title">Root log in</div>
            <form
            // onSubmit={form.handleSubmit}
            >
              <InputTextField
                className="password"
                placeholder={`Password`}
                type="password"
                name="password"
                edit
                disabled={submitting}
                // value={form.values.password}
                onChange={({ target: { value } }) => setRootPassword(value)}
                // error={shouldShowErrors && form.errors.password}
              />
              {/* {wrongCreds && (
                    <div className="error">
                      <Trans>Incorrect username or password</Trans>
                    </div>
                  )} */}
              <button type="submit" style={{ display: 'none' }} />
            </form>
            <div className="bottom">
              <div className="content">
                <div className="left">
                  <PrimaryButton
                    disabled={submitting}
                    onClick={rootLogin}
                    // onClick={
                    //   form.isSubmitting || form.isValidating
                    //     ? undefined
                    //     : form.submitForm
                    // }
                  >
                    Log in
                  </PrimaryButton>
                  {loginFailed ? <span>Login failed</span> : null}
                </div>
                {/* <div className="right" hidden>
                  <div className="icon">
                    <img
                      alt="apple RootLogin"
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                    />
                  </div>
                  <div className="icon">
                    <img
                      alt="google RootLogin"
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

RootLogin.displayName = 'RootLoginPage'

import { FC } from 'react'
// import { Link } from '../../../../elements/link'
import Card from '../../../atoms/Card/Card'
import { InputTextField } from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import { MainLayout } from '../../../layout'
import './RootLogin.scss'

export type RootLoginFormValues = { email: string; password: string }
export type RootLoginProps = {}

export const RootLogin: FC<RootLoginProps> = () => {
  return (
    <MainLayout headerType="minimalistic">
      <RootLoginBody />
    </MainLayout>
  )
}
export const RootLoginBody: FC<RootLoginProps> = ({}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      // form.submitForm()
    }
  }

  // const shouldShowErrors = !!form.submitCount && (wrongCreds || !form.isValid)
  // console.log({
  //   submitCount: form.submitCount,
  //   wrongCreds,
  //   isValid: form.isValid,
  // })

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
                // value={form.values.password}
                // onChange={form.handleChange}
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
                  // onClick={
                  //   form.isSubmitting || form.isValidating
                  //     ? undefined
                  //     : form.submitForm
                  // }
                  >
                    Log in
                  </PrimaryButton>
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

import { useFormik } from 'formik'
import lib from 'moodlenet-react-app-lib'
import { FC, useContext, useState } from 'react'
import { SimpleEmailAuthExt } from '..'

const { InputTextField, PrimaryButton, TertiaryButton } = lib.ui.components.atoms
export type LoginFormValues = { email: string; password: string }

export const Icon: FC = () => <PrimaryButton color="blue">Using email</PrimaryButton>
export const Panel: FC = () => {
  const [wrongCreds, setWrongCreds] = useState(false)
  const auth = useContext(lib.auth.AuthCtx)
  const form = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '' },
    async onSubmit({ email, password }) {
      setWrongCreds(false)
      const res = await lib.priHttp.fetch<SimpleEmailAuthExt>('@moodlenet/simple-email-auth', '0.1.0')('login')({
        email,
        password,
      })

      if (!res.success) {
        setWrongCreds(true)
        return
      }
      setWrongCreds(false)
      auth.setSessionToken(res.sessionToken)
    },
  })
  const shouldShowErrors = !!form.submitCount
  const canSubmit = !form.isSubmitting && !form.isValidating
  const disable = form.isSubmitting
  return (
    <>
      <form onSubmit={form.handleSubmit}>
        <InputTextField
          className="email"
          placeholder={`Email`}
          type="email"
          name="email"
          edit
          disabled={disable}
          value={form.values.email}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.email}
        />
        <InputTextField
          className="password"
          placeholder={`Password`}
          type="password"
          name="password"
          edit
          disabled={disable}
          value={form.values.password}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.password}
        />
        {wrongCreds && <div className="error">Incorrect username or password</div>}
        <button type="submit" style={{ display: 'none' }} />
      </form>
      <div className="bottom">
        <div className="content">
          <div className="left">
            <PrimaryButton onClick={canSubmit ? form.submitForm : undefined}>Log in</PrimaryButton>
            {/* <Link href={``}> */}
            <TertiaryButton>or recover password</TertiaryButton>
            {/* </Link> */}
          </div>
          {/* <div className="right" hidden>
                    <div className="icon">
                      <img
                        alt="apple login"
                        src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                      />
                    </div>
                    <div className="icon">
                      <img
                        alt="google login"
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      />
                    </div>
                  </div> */}
        </div>
      </div>
    </>
  )
}

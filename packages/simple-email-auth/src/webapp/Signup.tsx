import MailOutlineIcon from '@material-ui/icons/MailOutline'
import { useFormik } from 'formik'
import lib from 'moodlenet-react-app-lib'
import { FC, useState } from 'react'
import { firstValueFrom } from 'rxjs'
import { SimpleEmailAuthExt } from '..'

const { InputTextField, PrimaryButton, Card } = lib.ui.components.atoms
export type SignupFormValues = { email: string; password: string; displayName: string }

export const Icon: FC = () => <span>email</span>
export const Panel: FC = () => {
  const [emailSent, setEmailSent] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const form = useFormik<SignupFormValues>({
    initialValues: { email: '', password: '', displayName: '' },
    async onSubmit({ email, password, displayName }) {
      setErrMsg('')
      const res = await firstValueFrom(
        lib.priHttp
          .sub<SimpleEmailAuthExt>(
            'moodlenet-simple-email-auth',
            '0.1.10',
          )('signup')({
            displayName,
            email,
            password,
          })
          .pipe(lib.priHttp.dematMessage()),
      )
      if (!res.msg.data.success) {
        setErrMsg(res.msg.data.msg)
        return
      }
      setEmailSent(true)
    },
  })
  const shouldShowErrors = !!form.submitCount
  const canSubmit = !form.isSubmitting && !form.isValidating
  const disable = emailSent || form.isSubmitting
  return (
    <>
      <form onSubmit={form.handleSubmit}>
        <InputTextField
          className="display-name"
          placeholder={`Display name`}
          name="displayName"
          edit
          disabled={disable}
          value={form.values.displayName}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.displayName}
        />
        <InputTextField
          className="email"
          type="email"
          placeholder={`Email`}
          name="email"
          edit
          disabled={disable}
          value={form.values.email}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.email}
        />
        <InputTextField
          className="password"
          type="password"
          placeholder={`Password`}
          name="password"
          edit
          disabled={disable}
          value={form.values.password}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.password}
        />
        <button id="signup-button" type="submit" style={{ display: 'none' }} />
      </form>
      <PrimaryButton onClick={canSubmit ? form.submitForm : undefined}>Sign up</PrimaryButton>
      <div hidden={!errMsg}>Signup error: {errMsg}</div>
      <div className={`success-content`} hidden={!emailSent}>
        {/* <div className={`success-content ${requestSent ? 'success' : ''}`}> */}
        <Card>
          <div className="content">
            <div className="title">Email sent!</div>
            <MailOutlineIcon className="icon" />
            <div className="subtitle">Check out your inbox and activate your account</div>
          </div>
        </Card>
      </div>
    </>
  )
}

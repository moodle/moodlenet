import {
  InputTextField,
  PrimaryButton,
  Snackbar,
  TertiaryButton,
} from '@moodlenet/react-app/ui.mjs'
import { useFormik } from 'formik'
import { FC, useState } from 'react'
import './Signup.scss'

export type SignupFormValues = { email: string; password: string; displayName: string }

export type SignupProps = {
  signUp(formValue: SignupFormValues): Promise<{ success: true } | { success: false; msg: string }>
}

export const Icon: FC = () => {
  return <PrimaryButton color="blue">Use email</PrimaryButton>
}
export const Panel: FC<SignupProps> = ({ signUp }) => {
  const [emailSent, setEmailSent] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const form = useFormik<SignupFormValues>({
    initialValues: { email: '', password: '', displayName: '' },
    async onSubmit({ email, password, displayName }) {
      setErrMsg('')
      const res = await signUp({
        displayName,
        email,
        password,
      })

      if (!res.success) {
        setErrMsg(res.msg)
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
      <div className="bottom">
        <PrimaryButton onClick={canSubmit ? form.submitForm : undefined}>Sign up</PrimaryButton>
        {/* <Link href={userAgreementHref} target="__blank"> */}
        <a>
          <TertiaryButton>You agree to our Terms &amp; Conditions</TertiaryButton>
        </a>
        {/* </Link> */}
      </div>
      <div hidden={!errMsg}>Signup error: {errMsg}</div>
      {/* <div className={`success-content`} hidden={!emailSent}> */}
      {/* <div className={`success-content ${requestSent ? 'success' : ''}`}> */}
      {/* <Card>
          <div className="content">
            <div className="title">Email sent!</div>
            <MailOutlineIcon className="icon" />
            <div className="subtitle">Check out your inbox and activate your account</div>
          </div>
        </Card>
      </div> */}
      {emailSent && <Snackbar type="success">Signup success! Login to start</Snackbar>}
    </>
  )
}

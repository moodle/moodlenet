import { InputTextField, PrimaryButton, TertiaryButton } from '@moodlenet/component-library'
import type { Href } from '@moodlenet/react-app/common'
import { Link } from '@moodlenet/react-app/ui'
import { MailOutline } from '@mui/icons-material'
import type { useFormik } from 'formik'
import type { FC } from 'react'
import './Signup.scss'

export type SignupFormValues = { email: string; password: string; displayName: string }

export type SignupProps = {
  form: ReturnType<typeof useFormik<SignupFormValues>>
  errMsg: string
  emailSent: boolean
  userAgreementHref: Href
}

export const SignupIcon: FC = () => {
  return <PrimaryButton color="blue">Use email</PrimaryButton>
}
export const SignupPanel: FC<SignupProps> = ({ emailSent, errMsg, form, userAgreementHref }) => {
  const shouldShowErrors = !!form.submitCount
  const canSubmit = !form.isSubmitting && !form.isValidating
  return (
    <>
      {!emailSent && (
        <>
          <form onSubmit={canSubmit ? form.handleSubmit : undefined}>
            <InputTextField
              className="display-name"
              placeholder={`Display name`}
              name="displayName"
              edit
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
              value={form.values.password}
              onChange={form.handleChange}
              error={shouldShowErrors && form.errors.password}
            />
            <button id="signup-button" type="submit" style={{ display: 'none' }} />
          </form>
          <div className="bottom">
            <PrimaryButton
              onClick={
                canSubmit ? () => form.handleSubmit() : undefined
              } /* onClick={canSubmit ? form.submitForm : undefined} */
            >
              Sign up
            </PrimaryButton>
            <Link href={userAgreementHref} target="__blank">
              <TertiaryButton>You agree to our Terms &amp; Conditions</TertiaryButton>
            </Link>
          </div>
          <div className="general-error" hidden={!errMsg}>
            {errMsg}
          </div>
        </>
      )}
      {emailSent && (
        <div className="email-sent">
          <MailOutline className="icon" />
          <div className="title">Email sent!</div>
          <div className="subtitle">Check out your inbox and activate your account</div>
        </div>
      )}
    </>
  )
}

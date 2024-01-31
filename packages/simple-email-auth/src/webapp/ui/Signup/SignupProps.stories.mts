import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import type { SignupFormValues, SignupProps } from './Signup.js'

export const useSignupPanelProps = (): SignupProps => {
  return {
    emailSent: false,
    errMsg: '',
    form: useFormik<SignupFormValues>({
      initialValues: { displayName: '', email: '', password: '' },
      onSubmit: action('signup clicked'),
    }),
  }
}

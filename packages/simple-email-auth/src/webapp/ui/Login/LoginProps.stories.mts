import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import type { LoginFormValues, LoginProps } from './Login.js'

export const useLoginStoriesProps = (override?: LoginProps): LoginProps => {
  return {
    wrongCreds: false,
    form: useFormik<LoginFormValues>({
      initialValues: { email: '', password: '' },
      onSubmit: action('Login clicked'),
    }),
    ...override,
  }
}

import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { LoginFormValues, LoginProps } from './LoginComponent.js'

export const useLoginStoriesProps = (): LoginProps => {
  return {
    wrongCreds: false,
    form: useFormik<LoginFormValues>({
      initialValues: { email: '', password: '' },
      onSubmit: action('Login clicked'),
    }),
  }
}

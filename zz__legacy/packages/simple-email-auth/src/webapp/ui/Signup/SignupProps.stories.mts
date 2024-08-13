import { overrideDeep } from '@moodlenet/component-library/common'
import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import type { PartialDeep } from 'type-fest'
import type { SignupFormValues, SignupProps } from './Signup.js'

export const useSignupPanelProps = (overrides?: PartialDeep<SignupProps>): SignupProps => {
  return overrideDeep<SignupProps>(
    {
      emailSent: false,
      errMsg: '',
      form: useFormik<SignupFormValues>({
        initialValues: { displayName: '', email: '', password: '' },
        onSubmit: action('signup clicked'),
      }),
    },
    overrides,
  )
}

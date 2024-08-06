import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import { FormikConfig, useFormik } from 'formik'
import { useEffect } from 'react'
import { object, SchemaOf, string } from 'yup'
import { href } from '../../../../elements/link'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import {
  NewPassword,
  NewPasswordFormValues,
  NewPasswordProps,
} from './NewPassword'

const meta: ComponentMeta<typeof NewPassword> = {
  title: 'Pages/Access/New Password',
  component: NewPassword,
  excludeStories: ['NewPasswordStoryProps', 'validationSchema'],
  parameters: { layout: 'fullscreen' },
}

export const validationSchema: SchemaOf<NewPasswordFormValues> = object({
  newPassword: string()
    .required(t`Please provide your new password`)
    .max(30)
    .min(6, 'Password is too short should be 6 chars minimum.'),
})

export const NewPasswordStoryProps = (override?: {
  props?: Partial<NewPasswordProps>
  formValues?: Partial<NewPasswordFormValues>
  formConfig?: Partial<FormikConfig<NewPasswordFormValues>>
}): NewPasswordProps => {
  return {
    accessHeaderProps: AccessHeaderStoryProps,
    form: useFormik<NewPasswordFormValues>({
      validationSchema,
      initialValues: {
        newPassword: '',
        ...override?.formValues,
      },
      onSubmit: action('submit login'),
      ...override?.formConfig,
    }),
    newPasswordErrorMessage: null,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  }
}

export const Default = () => {
  const props = NewPasswordStoryProps()
  return <NewPassword {...props} />
}
export const Error = () => {
  const props = NewPasswordStoryProps()
  useEffect(() => {
    props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <NewPassword {...props} />
}

export default meta

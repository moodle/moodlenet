import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { ComponentMeta } from '@storybook/react'
import { FormikConfig, useFormik } from 'formik'
import { useEffect } from 'react'
import { object, SchemaOf, string } from 'yup'
import { href } from '../../../../elements/link'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import {
  RecoverPassword,
  RecoverPasswordFormValues,
  RecoverPasswordProps,
} from './RecoverPassword'

const meta: ComponentMeta<typeof RecoverPassword> = {
  title: 'Pages/Access/Recover Password',
  component: RecoverPassword,
  excludeStories: ['RecoverPasswordStoryProps', 'validationSchema'],
  parameters: { layout: 'fullscreen' },
}

export const validationSchema: SchemaOf<RecoverPasswordFormValues> = object({
  email: string()
    .email()
    .required(t`Please provide your email`),
})
export const RecoverPasswordStoryProps = (override?: {
  props?: Partial<RecoverPasswordProps>
  formValues?: Partial<RecoverPasswordFormValues>
  formConfig?: Partial<FormikConfig<RecoverPasswordFormValues>>
}): RecoverPasswordProps => {
  return {
    accessHeaderProps: AccessHeaderStoryProps,
    form: useFormik<RecoverPasswordFormValues>({
      validationSchema,
      onSubmit: (values) => {
        action('submit change password')(values)
        linkTo('', 'Email Sent')()
      },
      initialValues: {
        email: '',
        ...override?.formValues,
      },
      ...override?.formConfig,
    }),
    RecoverPasswordErrorMessage: null,
    requestSent: false,
    landingHref: href('Pages/Landing/Logged In'),
    loginHref: href('Pages/Access/Login/Default'),
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
    ...override?.props,
  }
}

export const Default = () => {
  const props = RecoverPasswordStoryProps()
  return <RecoverPassword {...props} />
}
export const Error = () => {
  const props = RecoverPasswordStoryProps()
  useEffect(() => {
    props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <RecoverPassword {...props} />
}

export const EmailSent = () => {
  const props = RecoverPasswordStoryProps({ props: { requestSent: true } })
  return <RecoverPassword {...props} />
}
export default meta

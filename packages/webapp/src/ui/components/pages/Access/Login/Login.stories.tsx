import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import { FormikConfig, useFormik } from 'formik'
import { useEffect } from 'react'
import { object, SchemaOf, string } from 'yup'
import { href } from '../../../../elements/link'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Login, LoginFormValues, LoginProps } from './Login'

const meta: ComponentMeta<typeof Login> = {
  title: 'Pages/Access/Login',
  component: Login,
  excludeStories: ['LoginStoryProps', 'validationSchema'],
  parameters: { layout: 'fullscreen' },
}

const validationSchema: SchemaOf<LoginFormValues> = object({
  email: string()
    .required(t`Please provide your email address`)
    .email(t`Please provide a valid email address`),
  password: string().required(t`Please provide a password`),
})

export const LoginStoryProps = (override?: {
  props?: Partial<LoginProps>
  formValues?: Partial<LoginFormValues>
  formConfig?: Partial<FormikConfig<LoginFormValues>>
}): LoginProps => {
  return {
    accessHeaderProps: AccessHeaderStoryProps,
    form: useFormik<LoginFormValues>({
      validationSchema,
      initialValues: { email: '', password: '', ...override?.formValues },
      onSubmit: action('submit login'),
      ...override?.formConfig,
    }),
    wrongCreds: false,
    signupHref: href('Pages/Access/SignUp/Default'),
    recoverPasswordHref: href('Pages/Recover Password/Recover'),
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
    ...override?.props,
  }
}

export const Default = () => {
  const props = LoginStoryProps()
  return <Login {...props} />
}

export const Error = () => {
  const props = LoginStoryProps({
    formConfig: {
      initialErrors: {
        email: 'Please provide an email',
        password: 'Please provide a password',
      },
    },
  })
  useEffect(() => {
    props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Login {...props} />
}
export const WrongCredentials = () => {
  const props = LoginStoryProps({
    props: {
      wrongCreds: true,
    },
  })
  useEffect(() => {
    props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Login {...props} />
}

export default meta

import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { ComponentMeta } from '@storybook/react'
import { FormikConfig, useFormik } from 'formik'
import { useEffect } from 'react'
import { object, SchemaOf, string } from 'yup'
import { href } from '../../../../elements/link'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Signup, SignupFormValues, SignupProps } from './Signup'

const meta: ComponentMeta<typeof Signup> = {
  title: 'Pages/Access/SignUp',
  component: Signup,
  excludeStories: ['validationSchema', 'SignupStoryProps'],
}
export const validationSchema: SchemaOf<SignupFormValues> = object({
  email: string()
    .email()
    .required(t`Please provide your email`),
  name: string()
    .max(30)
    .min(3)
    .required(t`Please provide a display name`),
  password: string()
    .required(t`Please provide a password`)
    .max(30)
    .min(6, 'Password is too short should be 6 chars minimum.'),
})

export const SignupStoryProps = (override?: {
  props?: Partial<SignupProps>
  formValues?: Partial<SignupFormValues>
  formConfig?: Partial<FormikConfig<SignupFormValues>>
}): SignupProps => {
  return {
    accessHeaderProps: AccessHeaderStoryProps,
    form: useFormik<SignupFormValues>({
      validationSchema,
      initialValues: {
        name: '',
        email: '',
        password: '',
        ...override?.formValues,
      },

      onSubmit: (values) => {
        action('submit signup')(values)
        linkTo('', 'Email Sent')()
      },
      ...override?.formConfig,
    }),
    signupErrorMessage: null,
    requestSent: false,
    landingHref: href('Pages/Landing/Logged In'),
    loginHref: href('Pages/Access/Login/Default'),
    userAgreementHref: href('Pages/Policies/UserAgreement/Default'),
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
    ...override?.props,
  }
}

export const Default = () => {
  const props = SignupStoryProps()
  return <Signup {...props} />
}
Default.parameters = { layout: 'fullscreen' }

export const Error = () => {
  const props = SignupStoryProps({
    props: {
      signupErrorMessage: 'A beautiful error message',
    },
  })
  useEffect(() => {
    props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Signup {...props} />
}
Default.parameters = { layout: 'fullscreen' }

export const EmailSent = () => {
  const props = SignupStoryProps({
    props: {
      requestSent: true,
    },
  })
  return <Signup {...props} />
}
Default.parameters = { layout: 'fullscreen' }

export default meta

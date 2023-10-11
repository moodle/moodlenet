// import { t } from '@lingui/macro'
import { MinimalisticHeaderStories } from '@moodlenet/react-app/stories'
import type { RootLoginProps } from '@moodlenet/web-user/ui'
import { RootLogin } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta } from '@storybook/react'
import { useEffect } from 'react'
import { FooterStoryProps } from '../../../components/organisms/Footer/Footer.stories.js'
// import { object, SchemaOf, string } from 'yup'
// import { href } from '../../../../elements/link'
// import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
// import { RootLogin, RootLoginFormValues, RootLoginProps } from './RootLogin'

const meta: ComponentMeta<typeof RootLogin> = {
  title: 'Pages/Access/RootLogin',
  component: RootLogin,
  excludeStories: ['RootLoginStoryProps', 'validationSchema'],
  parameters: { layout: 'fullscreen' },
}

// const validationSchema: SchemaOf<RootLoginFormValues> = object({
//   email: string()
//     .required(t`Please provide your email address`)
//     .email(t`Please provide a valid email address`),
//   password: string().required(t`Please provide a password`),
// })

export const RootLoginStoryProps = (
  override?: Partial<RootLoginProps>,
  // formValues?: Partial<RootLoginFormValues>
  // formConfig?: Partial<FormikConfig<RootLoginFormValues>>
): RootLoginProps => {
  return {
    loginFailed: false,
    submitLogin: action('submit RootLogin'),
    simpleLayoutProps: {
      headerProps: MinimalisticHeaderStories.MinimalisticHeaderStoryProps(),
      footerProps: FooterStoryProps,
    },
    // accessHeaderProps: AccessHeaderStoryProps,
    // form: useFormik<RootLoginFormValues>({
    //   validationSchema,
    //   initialValues: { email: '', password: '', ...override?.formValues },
    //   onSubmit: action('submit RootLogin'),
    //   ...override?.formConfig,
    // }),
    // wrongCreds: false,
    // signupHref: href('Pages/Access/SignUp/Default'),
    // recoverPasswordHref: href('Pages/Recover Password/Recover'),
    // mainPageWrapperProps: {
    //   userAcceptsPolicies: null,
    //   cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    // },
    ...override,
  }
}
// export const RootLoginStoryProps: RootLoginP = {
//   page: 'RootLogin',
//   headerProps: MinimalisticHeaderStoryProps,
//   //   homeHrpef: href('Landing/Logged In'),
//   // organization: { ...SimpleLayoutTitleStoryProps },
// }

export const Default = () => {
  const props = RootLoginStoryProps()
  return <RootLogin {...props} />
}

export const Error = () => {
  const props = RootLoginStoryProps({ loginFailed: true })
  // {
  // formConfig: {
  //   initialErrors: {
  //     email: 'Please provide an email',
  //     password: 'Please provide a password',
  //   },
  // },
  // }
  // )

  useEffect(() => {
    // props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <RootLogin {...props} />
}
export const WrongCredentials = () => {
  const props = RootLoginStoryProps({ loginFailed: true })
  //   {
  //   props: {
  //     wrongCreds: true,
  //   },
  // })
  useEffect(() => {
    // props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <RootLogin {...props} />
}

export default meta

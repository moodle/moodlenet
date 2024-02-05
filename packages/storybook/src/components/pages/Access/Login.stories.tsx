// import { t } from '@lingui/macro'
import { href } from '@moodlenet/react-app/common'
import { MinimalisticHeaderStories } from '@moodlenet/react-app/stories'
import { LoginPropsStories } from '@moodlenet/simple-email-auth/stories'
import { LoginIcon, LoginPanel } from '@moodlenet/simple-email-auth/ui'
import { MinimalisticAccessButtonsStories } from '@moodlenet/web-user/stories'
import type { LoginProps } from '@moodlenet/web-user/ui'
import { LoginPage } from '@moodlenet/web-user/ui'
import type { Meta as ComponentMeta } from '@storybook/react'
import { useEffect } from 'react'
import { FooterStoryProps } from '../../../components/organisms/Footer/Footer.stories.js'
// import { object, SchemaOf, string } from 'yup'
// import { href } from '../../../../elements/link'
// import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
// import { Login, LoginFormValues, LoginProps } from './Login'

const meta: ComponentMeta<typeof LoginPage> = {
  title: 'Pages/Access/Login',
  component: LoginPage,
  excludeStories: ['LoginStoryProps', 'validationSchema'],
}

// const validationSchema: SchemaOf<LoginFormValues> = object({
//   email: string()
//     .required(t`Please provide your email address`)
//     .email(t`Please provide a valid email address`),
//   password: string().required(t`Please provide a password`),
// })

export const LoginStoryProps = (): // override?: {
// props?: Partial<LoginProps>
// formValues?: Partial<LoginFormValues>
// formConfig?: Partial<FormikConfig<LoginFormValues>>
// }
LoginProps => {
  return {
    loginItems: [
      // { Icon: PrimaryButton, Panel: FileUploader },
      {
        Icon: LoginIcon,
        Panel: () => <LoginPanel {...LoginPropsStories.useLoginStoriesProps()} />,
        key: 'email-auth',
      },
      // { Icon: PassportAuth.Icon, Panel: PassportAuth.Panel },
    ],
    headerProps: MinimalisticHeaderStories.MinimalisticHeaderStoryProps(
      MinimalisticAccessButtonsStories.getMinimalisticAccessHeaderItems({
        loginHref: href('Pages/Access/Login/Default'),
        signupHref: href('Pages/Access/SignUp/Default'),
        showLearnMoreButton: true,
        showLoginButton: false,
        showSignupButton: true,
      }),
    ),
    footerProps: FooterStoryProps,
    signupHref: href('Pages/Access/SignUp/Default'),
    // accessHeaderProps: AccessHeaderStoryProps,
    // form: useFormik<LoginFormValues>({
    //   validationSchema,
    //   initialValues: { email: '', password: '', ...override?.formValues },
    //   onSubmit: action('submit login'),
    //   ...override?.formConfig,
    // }),
    // wrongCreds: false,
    // signupHref: href('Pages/Access/SignUp/Default'),
    // recoverPasswordHref: href('Pages/Recover Password/Recover'),
    // mainPageWrapperProps: {
    //   userAcceptsPolicies: null,
    //   cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    // },
    // ...override?.props,
  }
}
// export const LoginStoryProps: LoginP = {
//   page: 'login',
//   headerProps: MinimalisticHeaderStoryProps,
//   //   homeHrpef: href('Landing/Logged In'),
//   // organization: { ...SimpleLayoutTitleStoryProps },
// }

export const Default = () => {
  const props = LoginStoryProps()
  return <LoginPage {...props} />
}

export const Error = () => {
  const props = LoginStoryProps()
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
  return <LoginPage {...props} />
}
export const WrongCredentials = () => {
  const props = LoginStoryProps()
  //   {
  //   props: {
  //     wrongCreds: true,
  //   },
  // })
  useEffect(() => {
    // props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <LoginPage {...props} />
}

export default meta

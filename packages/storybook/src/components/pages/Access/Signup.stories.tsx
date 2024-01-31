// import { t } from '@lingui/macro'
import { MinimalisticHeaderStories } from '@moodlenet/react-app/stories'
import type { Meta as ComponentMeta } from '@storybook/react'
import { useEffect } from 'react'
// import * as SimpleEmailAuth from '../../../../../../../../simple-email-auth/dist/webapp/Signup.js'

import { overrideDeep } from '@moodlenet/component-library/common'
import { href } from '@moodlenet/react-app/common'
import { SignupPropsStories } from '@moodlenet/simple-email-auth/stories'
import { SignupIcon, SignupPanel } from '@moodlenet/simple-email-auth/ui'
import { MinimalisticAccessButtonsStories } from '@moodlenet/web-user/stories'
import type { SignupProps } from '@moodlenet/web-user/ui'
import { Signup } from '@moodlenet/web-user/ui'
import type { PartialDeep } from 'type-fest'
import { FooterStoryProps } from '../../../components/organisms/Footer/Footer.stories.js'
// import { object, SchemaOf, string } from 'yup'
// import { href } from '../../../../elements/link'
// import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
// import { Signup, SignupFormValues, SignupProps } from './Signup'

const meta: ComponentMeta<typeof Signup> = {
  title: 'Pages/Access/Signup',
  component: Signup,
  excludeStories: ['SignupStoryProps', 'validationSchema'],
  parameters: { layout: 'fullscreen' },
}

// const validationSchema: SchemaOf<SignupFormValues> = object({
//   email: string()
//     .required(t`Please provide your email address`)
//     .email(t`Please provide a valid email address`),
//   password: string().required(t`Please provide a password`),
// })

export const SignupStoryProps = (
  overrides?: PartialDeep<SignupProps>,
): // override?: {
// props?: Partial<SignupProps>
// formValues?: Partial<SignupFormValues>
// formConfig?: Partial<FormikConfig<SignupFormValues>>
// }
SignupProps => {
  return overrideDeep<SignupProps>(
    {
      signupItems: [
        {
          Icon: SignupIcon,
          Panel: () => <SignupPanel {...SignupPropsStories.useSignupPanelProps()} />,
          key: 'email-auth',
        },
        // { Icon: PrimaryButton, Panel: FileUploader },
        // { Icon: PassportAuth.Icon, Panel: PassportAuth.Panel },
      ],
      headerProps: MinimalisticHeaderStories.MinimalisticHeaderStoryProps(
        MinimalisticAccessButtonsStories.getMinimalisticAccessHeaderItems({
          loginHref: href('Pages/Access/Login/Default'),
          signupHref: href('Pages/Access/SignUp/Default'),
          showLearnMoreButton: true,
          showLoginButton: true,
          showSignupButton: false,
        }),
      ),
      footerProps: FooterStoryProps,
      loginHref: href('Pages/Access/Login/Default'),
      userAgreementHref: href('Pages/Policies/UserAgreement/Default'),
      // accessHeaderProps: AccessHeaderStoryProps,
      // form: useFormik<SignupFormValues>({
      //   validationSchema,
      //   initialValues: { email: '', password: '', ...override?.formValues },
      //   onSubmit: action('submit Signup'),
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
    },
    overrides,
  )
}
// export const SignupStoryProps: SignupP = {
//   page: 'Signup',
//   headerProps: MinimalisticHeaderStoryProps,
//   //   homeHrpef: href('Landing/Logged In'),
//   // organization: { ...SimpleLayoutTitleStoryProps },
// }

export const Default = () => {
  const props = SignupStoryProps()
  return <Signup {...props} />
}

export const Error = () => {
  const props = SignupStoryProps({
    signupItems: [],
  })
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
  return <Signup {...props} />
}
export const WrongCredentials = () => {
  const props = SignupStoryProps()
  //   {
  //   props: {
  //     wrongCreds: true,
  //   },
  // })
  useEffect(() => {
    // props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Signup {...props} />
}

export default meta

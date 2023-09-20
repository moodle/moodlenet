// import { t } from '@lingui/macro'
import { MinimalisticHeaderStories } from '@moodlenet/react-app/stories'
import type { Meta as ComponentMeta } from '@storybook/react'
import { useEffect } from 'react'
import type { PartialDeep } from 'type-fest'
// import * as SimpleEmailAuth from '../../../../../../../../simple-email-auth/dist/webapp/RecoverPassword.js'

import { overrideDeep } from '@moodlenet/component-library/common'
import { href } from '@moodlenet/react-app/common'
import type { RecoverPasswordProps } from '@moodlenet/simple-email-auth/ui'
import { RecoverPassword } from '@moodlenet/simple-email-auth/ui'
import { MinimalisticAccessButtonsStories } from '@moodlenet/web-user/stories'
import { action } from '@storybook/addon-actions'
import { FooterStoryProps } from '../../../components/organisms/Footer/Footer.stories.js'
// import { object, SchemaOf, string } from 'yup'
// import { href } from '../../../../elements/link'
// import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
// import { RecoverPassword, RecoverPasswordFormValues, RecoverPasswordProps } from './RecoverPassword'

const meta: ComponentMeta<typeof RecoverPassword> = {
  title: 'Pages/Access/RecoverPassword',
  component: RecoverPassword,
  excludeStories: ['useRecoverPasswordStoryProps', 'validationSchema'],
  parameters: { layout: 'fullscreen' },
}

// const validationSchema: SchemaOf<RecoverPasswordFormValues> = object({
//   email: string()
//     .required(t`Please provide your email address`)
//     .email(t`Please provide a valid email address`),
//   password: string().required(t`Please provide a password`),
// })

export const useRecoverPasswordStoryProps = (
  overrides?: PartialDeep<RecoverPasswordProps>,
): RecoverPasswordProps => {
  return overrideDeep<RecoverPasswordProps>(
    {
      headerProps: MinimalisticHeaderStories.MinimalisticHeaderStoryProps(
        MinimalisticAccessButtonsStories.getAccesMinimalisticHeaderItems({
          showLoginButton: true,
          loginHref: href('Pages/Access/Login/Default'),
          showSignupButton: false,
          signupHref: href('Pages/Access/Signup/Default'),
          showLearnMoreButton: true,
        }),
      ),
      footerProps: FooterStoryProps,
      requestSent: false,
      requestPasswordChange: action('requestPasswordChange'),
    },
    overrides,
  )
}

export const Default = () => {
  const props = useRecoverPasswordStoryProps()
  return <RecoverPassword {...props} />
}

export const Success = () => {
  const props = useRecoverPasswordStoryProps({ requestSent: true })
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
  return <RecoverPassword {...props} />
}

export const Error = () => {
  const props = useRecoverPasswordStoryProps()
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
  return <RecoverPassword {...props} />
}
export const WrongCredentials = () => {
  const props = useRecoverPasswordStoryProps()
  //   {
  //   props: {
  //     wrongCreds: true,
  //   },
  // })
  useEffect(() => {
    // props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <RecoverPassword {...props} />
}

export default meta

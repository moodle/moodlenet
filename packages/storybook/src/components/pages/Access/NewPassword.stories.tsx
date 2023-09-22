import { overrideDeep } from '@moodlenet/component-library/common'
import { href } from '@moodlenet/react-app/common'
import { MinimalisticHeaderStories } from '@moodlenet/react-app/stories'
import type { NewPasswordProps } from '@moodlenet/simple-email-auth/ui'
import { NewPassword } from '@moodlenet/simple-email-auth/ui'
import { MinimalisticAccessButtonsStories } from '@moodlenet/web-user/stories'
import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta } from '@storybook/react'
import { useEffect } from 'react'
import type { PartialDeep } from 'type-fest'
import { FooterStoryProps } from '../../../components/organisms/Footer/Footer.stories.js'

const meta: ComponentMeta<typeof NewPassword> = {
  title: 'Pages/Access/NewPassword',
  component: NewPassword,
  excludeStories: ['useNewPasswordStoryProps', 'validationSchema'],
  parameters: { layout: 'fullscreen' },
}

export const useNewPasswordStoryProps = (
  overrides?: PartialDeep<NewPasswordProps>,
): NewPasswordProps => {
  return overrideDeep<NewPasswordProps>(
    {
      headerProps: MinimalisticHeaderStories.MinimalisticHeaderStoryProps(
        MinimalisticAccessButtonsStories.getAccesMinimalisticHeaderItems({
          showLoginButton: false,
          loginHref: href('Pages/Access/Login/Default'),
          showSignupButton: false,
          signupHref: href('Pages/Access/Signup/Default'),
          showLearnMoreButton: false,
        }),
      ),
      footerProps: FooterStoryProps,
      changePassword: action('requestPasswordChange'),
    },
    overrides,
  )
}

export const Default = () => {
  const props = useNewPasswordStoryProps()
  return <NewPassword {...props} />
}

export const Success = () => {
  const props = useNewPasswordStoryProps({})
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
  return <NewPassword {...props} />
}

export const Error = () => {
  const props = useNewPasswordStoryProps()
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
  return <NewPassword {...props} />
}
export const WrongCredentials = () => {
  const props = useNewPasswordStoryProps()
  //   {
  //   props: {
  //     wrongCreds: true,
  //   },
  // })
  useEffect(() => {
    // props.form.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <NewPassword {...props} />
}

export default meta

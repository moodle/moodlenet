import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { SBFormikBag } from '../../../../lib/storybook/SBFormikBag'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import {
  RecoverPassword,
  RecoverPasswordFormValues,
  RecoverPasswordProps,
} from './RecoverPassword'

const meta: ComponentMeta<typeof RecoverPassword> = {
  title: 'Pages/Access/Recover Password',
  component: RecoverPassword,
  excludeStories: [
    'RecoverPasswordErrorStoryProps',
    'RecoverPasswordStoryProps',
    'EmailSendStoryProps',
  ],
  parameters: { layout: 'fullscreen' },
}

const RecoverPasswordStory: ComponentStory<typeof RecoverPassword> = (args) => (
  <RecoverPassword {...args} />
)

export const RecoverPasswordStoryProps: RecoverPasswordProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  formBag: SBFormikBag<RecoverPasswordFormValues>(
    { email: '' },
    { submitForm: linkTo('', 'Email Sent') }
  ),
  RecoverPasswordErrorMessage: null,
  requestSent: false,
  landingHref: href('Pages/Landing/Logged In'),
  loginHref: href('Pages/Access/Login/Default'),
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}

export const RecoverPasswordErrorStoryProps: RecoverPasswordProps = {
  ...RecoverPasswordStoryProps,
  RecoverPasswordErrorMessage: 'A beautiful error message',
  formBag: SBFormikBag<RecoverPasswordFormValues>(
    { email: '' },
    {
      submitForm: linkTo('', 'Email Sent'),
      errors: {
        email: 'Please provide an email',
      },
      submitCount: 1,
    }
  ),
}

export const EmailSendStoryProps: RecoverPasswordProps = {
  ...RecoverPasswordStoryProps,
  requestSent: true,
}

export const Default = RecoverPasswordStory.bind({})
Default.args = RecoverPasswordStoryProps

export const Error = RecoverPasswordStory.bind({})
Error.args = RecoverPasswordErrorStoryProps

export const EmailSent = RecoverPasswordStory.bind({})
EmailSent.args = EmailSendStoryProps

export default meta

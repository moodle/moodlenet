import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { RecoverPassword, RecoverPasswordFormValues, RecoverPasswordProps } from './RecoverPassword'

const meta: ComponentMeta<typeof RecoverPassword> = {
  title: 'Pages/Recover Password',
  component: RecoverPassword,
  excludeStories: ['RecoverPasswordErrorStoryProps', 'RecoverPasswordStoryProps', 'EmailSendStoryProps'],
  parameters: { layout: 'fullscreen' }
}

const RecoverPasswordStory: ComponentStory<typeof RecoverPassword> = args => <RecoverPassword {...args} />

export const RecoverPasswordStoryProps: RecoverPasswordProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  formBag: SBFormikBag<RecoverPasswordFormValues>({ email: '' }, { submitForm: linkTo('', 'Email Sent') }),
  RecoverPasswordErrorMessage: null,
  requestSent: false,
  landingHref: href('Pages/Landing/Logged In'),
  loginHref: href('Pages/Login/Default'),
}

export const RecoverPasswordErrorStoryProps: RecoverPasswordProps = {
  ...RecoverPasswordStoryProps,
  RecoverPasswordErrorMessage: 'A beautiful error message',
}

export const EmailSendStoryProps: RecoverPasswordProps = {
  ...RecoverPasswordStoryProps,
  requestSent: true,
}

export const Recover = RecoverPasswordStory.bind({})
Recover.args = RecoverPasswordStoryProps

export const RecoverError = RecoverPasswordStory.bind({})
RecoverError.args = RecoverPasswordErrorStoryProps

export const EmailSent = RecoverPasswordStory.bind({})
EmailSent.args = EmailSendStoryProps

export default meta

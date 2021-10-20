import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { SBFormikBag } from '../../../../lib/storybook/SBFormikBag'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { NewPassword, NewPasswordFormValues, NewPasswordProps } from './NewPassword'

const meta: ComponentMeta<typeof NewPassword> = {
  title: 'Pages/New Password',
  component: NewPassword,
  excludeStories: ['NewPasswordStory', 'NewPasswordStoryProps', 'NewPasswordErrorStoryProps'],
  parameters: { layout: 'fullscreen' },
}

const NewPasswordStory: ComponentStory<typeof NewPassword> = args => <NewPassword {...args} />

export const NewPasswordStoryProps: NewPasswordProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  formBag: SBFormikBag<NewPasswordFormValues>({
    newPassword: '',
  }),
  newPasswordErrorMessage: null,
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}

export const NewPasswordErrorStoryProps: NewPasswordProps = {
  ...NewPasswordStoryProps,
  newPasswordErrorMessage: 'At least 6 characters needed',
}

export const Default = NewPasswordStory.bind({})
Default.args = NewPasswordStoryProps

export const Error = NewPasswordStory.bind({})
Error.args = NewPasswordErrorStoryProps

export default meta

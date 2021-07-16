import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Login, LoginProps } from './Login'

const meta: ComponentMeta<typeof Login> = {
  title: 'Pages/Login',
  component: Login,
  excludeStories: ['LoginStoryProps'],
}

const LoginStory: ComponentStory<typeof Login> = args => <Login {...args} />

export const LoginStoryProps: LoginProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  onSubmit: action('Submit login'),
  loginErrorMessage: null,
}

export const LoginPage = LoginStory.bind({})
LoginPage.args = LoginStoryProps
LoginPage.parameters = { layout: 'fullscreen' }

export default meta

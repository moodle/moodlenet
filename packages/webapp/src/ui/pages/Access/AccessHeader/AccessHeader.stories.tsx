import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  HeaderLoggedOutOrganizationStoryProps,
  HeaderLoggedOutStoryProps
} from '../../../components/Header/Header.stories'
import { href } from '../../../elements/link'
import { AccessHeader, AccessHeaderProps } from './AccessHeader'

const meta: ComponentMeta<typeof AccessHeader> = {
  title: 'Components/Organisms/Headers/AccessHeader',
  component: AccessHeader,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AccessHeaderStoryProps', 'AccessOrganizationHeaderStoryProps'],
}

export const AccessHeaderStoryProps: AccessHeaderProps = {
  organization: HeaderLoggedOutStoryProps.organization,
  homeHref: href('Pages/Landing/Logged Out'),
  signupHref: href('Pages/SignUp/Sign Up'),
  loginHref: href('Pages/Login/Default'),
  page: 'login',
}

export const AccessOrganizationHeaderStoryProps: AccessHeaderProps = {
  ...AccessHeaderStoryProps,
  organization: HeaderLoggedOutOrganizationStoryProps.organization,
  homeHref: href('Landing/Organization Logged Out'),
  page: 'signup',
}

const AccessHeaderStory: ComponentStory<typeof AccessHeader> = args => <AccessHeader {...args} />

export const Moodle = AccessHeaderStory.bind({})
Moodle.args = AccessHeaderStoryProps
Moodle.parameters = { layout: 'fullscreen' }

export const Organization = AccessHeaderStory.bind({})
Organization.args = AccessOrganizationHeaderStoryProps
Organization.parameters = { layout: 'fullscreen' }

export default meta

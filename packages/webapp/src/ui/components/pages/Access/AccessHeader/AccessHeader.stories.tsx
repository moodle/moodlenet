import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import {
  HeaderLoggedOutOrganizationStoryProps,
  HeaderLoggedOutStoryProps,
} from '../../../organisms/Header/Header.stories'
import { AccessHeader, AccessHeaderProps } from './AccessHeader'

const meta: ComponentMeta<typeof AccessHeader> = {
  title: 'Organisms/Access/AccessHeader',
  component: AccessHeader,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'AccessHeaderStoryProps',
    'AccessOrganizationHeaderStoryProps',
  ],
}

export const AccessHeaderStoryProps: AccessHeaderProps = {
  organization: HeaderLoggedOutStoryProps.organization,
  homeHref: href('Pages/Landing/Logged Out'),
  signupHref: href('Pages/Access/SignUp/Default'),
  loginHref: href('Pages/Access/Login/Default'),
  page: 'login',
}

export const AccessOrganizationHeaderStoryProps: AccessHeaderProps = {
  ...AccessHeaderStoryProps,
  organization: HeaderLoggedOutOrganizationStoryProps.organization,
  homeHref: href('Landing/Organization Logged Out'),
  page: 'signup',
}

const AccessHeaderStory: ComponentStory<typeof AccessHeader> = (args) => (
  <AccessHeader {...args} />
)

export const Moodle = AccessHeaderStory.bind({})
Moodle.args = AccessHeaderStoryProps
Moodle.parameters = { layout: 'fullscreen' }

export const Organization = AccessHeaderStory.bind({})
Organization.args = AccessOrganizationHeaderStoryProps
Organization.parameters = { layout: 'fullscreen' }

export default meta

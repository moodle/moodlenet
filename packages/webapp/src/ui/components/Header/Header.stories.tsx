import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../elements/link'
import { Header, HeaderPropsIdle } from './Header'

const meta: ComponentMeta<typeof Header> = {
  title: 'Components/Headers/Header',
  component: Header,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'HeaderLoggedInStoryProps',
    'HeaderLoggedOutStoryProps',
    'HeaderLoggedInOrganizationStoryProps',
    'HeaderLoggedOutOrganizationStoryProps',
  ],
}

export const HeaderLoggedInStoryProps: HeaderPropsIdle = {
  status: 'idle',
  organization: {
    name: 'MoodleNet',
    url: 'https://www.moodle.com/',
    logo: '',
  },
  homeHref: href('Landing/Logged In'),
  me: {
    myProfileHref: href('Pages/Profile/LoggedIn'),
    avatar: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
    name: 'username',
  },
  loginHref: href('Pages/Login/LoginPage'),
  signUpHref: href('Pages/SignUp/SignUpPage'),
  logoutHref: href('Pages/Login/LoginPage'),
  newResourceHref: href('Pages/New Resource/Default'),
  newCollectionHref: href('Pages/New Collection/Default'),
  searchText: '',
  setSearchText: action('setSearchText'),
}

export const HeaderLoggedOutStoryProps: HeaderPropsIdle = {
  ...HeaderLoggedInStoryProps,
  me: null,
}

export const HeaderLoggedInOrganizationStoryProps: HeaderPropsIdle = {
  ...HeaderLoggedInStoryProps,
  organization: {
    ...HeaderLoggedInStoryProps.organization,
    name: 'BFH',
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
  },
}

export const HeaderLoggedOutOrganizationStoryProps: HeaderPropsIdle = {
  ...HeaderLoggedInOrganizationStoryProps,
  me: null,
}

const HeaderStory: ComponentStory<typeof Header> = args => <Header {...args} />

export const LoggedIn = HeaderStory.bind({})
LoggedIn.args = HeaderLoggedInStoryProps
LoggedIn.parameters = { layout: 'fullscreen' }

export const LoggedOut = HeaderStory.bind({})
LoggedOut.args = HeaderLoggedOutStoryProps
LoggedOut.parameters = { layout: 'fullscreen' }

export const LoggedInOrganization = HeaderStory.bind({})
LoggedInOrganization.args = HeaderLoggedInOrganizationStoryProps
LoggedInOrganization.parameters = { layout: 'fullscreen' }

export const LoggedOutOrganization = HeaderStory.bind({})
LoggedOutOrganization.args = HeaderLoggedOutOrganizationStoryProps
LoggedOutOrganization.parameters = { layout: 'fullscreen' }

export default meta

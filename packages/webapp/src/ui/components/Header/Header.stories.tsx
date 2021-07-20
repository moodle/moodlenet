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
  excludeStories: ['HeaderStoryProps', 'HeaderMoodleStoryProps'],
}

export const HeaderMoodleStoryProps: HeaderPropsIdle = {
  status: 'idle',
  organization: {
    name: 'MoodleNet',
    url: 'https://www.moodle.com/',
    logo: '',
  },
  homeHref: href('Landing/Logged In'),
  me: {
    avatar: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
    username: 'username',
  },
  loginHref: href('Login/Default'),
  searchText: '',
  setSearchText: action('setSearchText'),
} as const

export const HeaderStoryProps: HeaderPropsIdle = {
  ...HeaderMoodleStoryProps, organization: {
    ...HeaderMoodleStoryProps.organization,
    name: 'BFH',
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
  }
}

const HeaderStory: ComponentStory<typeof Header> = args => <Header {...args} />

export const Moodle = HeaderStory.bind({})
Moodle.args = HeaderMoodleStoryProps
Moodle.parameters = { layout: 'fullscreen' }

export const Organization = HeaderStory.bind({})
Organization.args = HeaderStoryProps
Organization.parameters = { layout: 'fullscreen' }

export default meta

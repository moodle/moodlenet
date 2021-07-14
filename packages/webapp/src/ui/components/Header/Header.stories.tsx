import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Header, HeaderPropsIdle } from './Header'

const meta: ComponentMeta<typeof Header> = {
  title: 'Components/Headers/Header',
  component: Header,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['HeaderStoryProps'],
}

export const HeaderStoryProps: HeaderPropsIdle = {
  status: 'idle',
  organization: {
    name: 'BFH',
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
  },
  avatar: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
  homeLink: 'https://moodle.com/moodlenet/',
  me: {
    username: 'string,',
  },
  loginLink: '',
} as const

const HeaderStory: ComponentStory<typeof Header> = args => <Header {...args} />

export const Default = HeaderStory.bind({})
Default.args = HeaderStoryProps
Default.parameters = { layout: 'fullscreen' }

export default meta

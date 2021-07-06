import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Header, HeaderProps } from './Header'

const meta: ComponentMeta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['HeaderStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const HeaderStoryProps: HeaderProps = {
  organization: {
    name: 'BFH',
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg'
  },
  avatar: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
}

const HeaderStory: ComponentStory<typeof Header> = args => <Header {...args} />

export const Default = HeaderStory.bind({})
Default.args = HeaderStoryProps

export default meta

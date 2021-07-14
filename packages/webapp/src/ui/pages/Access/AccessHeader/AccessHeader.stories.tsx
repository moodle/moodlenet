import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AccessHeader, AccessHeaderProps } from './AccessHeader'

const meta: ComponentMeta<typeof AccessHeader> = {
  title: 'Components/Headers/AccessHeader',
  component: AccessHeader,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AccessHeaderStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const AccessHeaderStoryProps: AccessHeaderProps = {
  organization: {
    name: 'BFH',
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg'
  },
}

const AccessHeaderStory: ComponentStory<typeof AccessHeader> = args => <AccessHeader {...args} />

export const Default = AccessHeaderStory.bind({})
Default.args = AccessHeaderStoryProps
Default.parameters = {layout: 'fullscreen'}

export default meta

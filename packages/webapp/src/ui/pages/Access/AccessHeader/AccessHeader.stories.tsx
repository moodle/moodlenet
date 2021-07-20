import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderMoodleStoryProps } from '../../../components/Header/Header.stories'
import { href } from '../../../elements/link'
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
  organization: HeaderMoodleStoryProps.organization,
  homeHref: href('Landing/Logged Out'),
}

const AccessHeaderStory: ComponentStory<typeof AccessHeader> = args => <AccessHeader {...args} />

export const Default = AccessHeaderStory.bind({})
Default.args = AccessHeaderStoryProps
Default.parameters = {layout: 'fullscreen'}

export default meta

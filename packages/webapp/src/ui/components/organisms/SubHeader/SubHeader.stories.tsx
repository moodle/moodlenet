import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TagListStory } from '../../../elements/tags'
import { SubHeader, SubHeaderProps } from './SubHeader'

const meta: ComponentMeta<typeof SubHeader> = {
  title: 'Organisms/SubHeader',
  component: SubHeader,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['SubHeaderStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', top: -60 }}>
        <Story />
      </div>
    ),
  ],
}

export const SubHeaderStoryProps: SubHeaderProps = {
  tags: TagListStory,
}

const SubHeaderStory: ComponentStory<typeof SubHeader> = (args) => (
  <SubHeader {...args} />
)

export const Default = SubHeaderStory.bind({})
Default.args = SubHeaderStoryProps
Default.parameters = { layout: 'fullscreen' }

export default meta

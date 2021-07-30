import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ProgressState, ProgressStateProps } from './ProgressState'

const meta: ComponentMeta<typeof ProgressState> = {
  title: 'Components/Atoms/ProgressState',
  component: ProgressState,
  excludeStories: ['ProgressStateStoryProps'],
  decorators: [
    Story => (
      <div style={{ width: 900 }}>
        <Story />
      </div>
    ),
  ],
}

const ProgressStateStory: ComponentStory<typeof ProgressState> = args => <ProgressState {...args} />

export const ProgressStateStoryProps: ProgressStateProps = {
  stateNames: [`Upload Resource`, `Add to Collections`, `Add Details`],
  currentIndex: 1,
}

export const Default = ProgressStateStory.bind({})
Default.args = ProgressStateStoryProps

export default meta

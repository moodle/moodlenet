import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ProgressState, ProgressStateProps } from './ProgressState'

const meta: ComponentMeta<typeof ProgressState> = {
  title: 'Atoms/ProgressState',
  component: ProgressState,
  excludeStories: ['ProgressStateStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ width: 900 }}>
        <Story />
      </div>
    ),
  ],
}

const ProgressStateStory: ComponentStory<typeof ProgressState> = (args) => (
  <ProgressState {...args} />
)

export const ProgressStateStoryProps: ProgressStateProps = {
  stateNames: [`Upload resource`, `Add to collections`, `Add details`],
  currentIndex: 1,
  progressSubtitles: [
    `sub:Upload resource`,
    `sub:Add to collections`,
    `sub:Add details`,
  ],
}

export const Default = ProgressStateStory.bind({})
Default.args = ProgressStateStoryProps

export default meta

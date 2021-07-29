import { ComponentMeta, ComponentStory } from '@storybook/react'
import { NewResourceProgressStateStory } from '../../../pages/NewResource/NewResource.stories'
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
  states: NewResourceProgressStateStory,
  currentState: 'Collections'
}

export const Default = ProgressStateStory.bind({})
Default.args = ProgressStateStoryProps

export default meta

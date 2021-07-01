import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { StoryProps, Task, TaskProps } from './Task'

export default {
  title: 'Test/Task',
  component: Task,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Task>

const TaskStory: ComponentStory<typeof Task> = args => <Task {...args} />

const task: TaskProps = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2021, 0, 1, 9, 0),
}

const storyprops: StoryProps = {
  task,
  onArchiveTask: action('onArchiveTask'),
  onPinTask: action('onPinTask'),
}

export const Default = TaskStory.bind({}, storyprops)

export const Pinned = TaskStory.bind(
  {},
  {
    ...storyprops,
    task: {
      ...task,
      state: 'TASK_PINNED',
    },
  },
)

export const Archived = TaskStory.bind(
  {},
  {
    ...storyprops,
    task: {
      ...task,
      state: 'TASK_ARCHIVED',
    },
  },
)

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Task } from './Task';

export default {
    title: 'Test/Task',
    component: Task,
    argTypes: {
    backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof Task>

const Template: ComponentStory<typeof Task> = args => <Task {...args} />


export const Default = Template.bind({})
Default.args = {
    task: {
        id: '1',
        title: 'Test Task',
        state: 'TASK_INBOX',
        updatedAt: new Date(2021, 0, 1, 9, 0),
    },
}

export const Pinned = Template.bind({})
Pinned.args = {
    task: {
        state: 'TASK_PINNED',
    },
    ...Default.args.task,
}


export const Archived = Template.bind({})
Archived.args = {
    task: {
        state: 'TASK_ARCHIVED',
    },
    ...Default.args.task,
}
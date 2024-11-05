'use client'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import type { LoadingProps } from './Loading'
import { Loading } from './Loading'

const meta: ComponentMeta<typeof Loading> = {
  title: 'Atoms/Loading',
  component: Loading,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['LoadingStoryProps'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div
        style={{
          height: 100,
          width: 300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export const LoadingStoryProps: LoadingProps = { color: 'orange', size: '40px' }

const LoadingStory: ComponentStory<typeof Loading> = args => <Loading {...args}></Loading>

export const Default: typeof LoadingStory = LoadingStory.bind({})
Default.args = LoadingStoryProps

export default meta

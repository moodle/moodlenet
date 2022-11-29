import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Loading, LoadingProps } from './Loading'

const meta: ComponentMeta<typeof Loading> = {
  title: 'Atoms/Loading',
  component: Loading,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['LoadingStoryProps'],
  decorators: [
    (Story) => (
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

export const LoadingStoryProps: LoadingProps = { color: 'orange', size: 40 }

const LoadingStory: ComponentStory<typeof Loading> = (args) => (
  <Loading {...args}></Loading>
)

export const Default = LoadingStory.bind({})
Default.args = LoadingStoryProps

export default meta

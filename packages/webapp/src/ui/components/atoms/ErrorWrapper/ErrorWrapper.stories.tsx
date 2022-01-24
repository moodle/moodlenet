import { ComponentMeta, ComponentStory } from '@storybook/react'
import InputTextField from '../InputTextField/InputTextField'
import { ErrorWrapper, ErrorWrapperProps } from './ErrorWrapper'

const meta: ComponentMeta<typeof ErrorWrapper> = {
  title: 'Atoms/ErrorWrapper',
  component: ErrorWrapper,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ErrorWrapperStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const ErrorWrapperStoryProps: ErrorWrapperProps = {
  error: 'Just a funny error',
}

const ErrorWrapperStory: ComponentStory<typeof ErrorWrapper> = (args) => (
  <ErrorWrapper {...args}>
    <InputTextField label="Another text field"></InputTextField>
  </ErrorWrapper>
)

export const Default = ErrorWrapperStory.bind({})
Default.args = ErrorWrapperStoryProps

export default meta

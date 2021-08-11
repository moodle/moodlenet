import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AddResources, AddResourcesProps } from './AddResources'

const meta: ComponentMeta<typeof AddResources> = {
  title: 'Pages/New Resource/Add To Collections',
  component: AddResources,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AddResourcesStoryProps', 'Default'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const AddResourcesStoryProps: AddResourcesProps = {
  setSearchText: action('setSearchText'),
  previousStep: action('previousStep'),
  nextStep: action('nextStep'),
  step: 'AddResourcesStep',
  setAddResources: action('setAddResources'),
  collections: ['Education', 'Biology', 'Algebra', 'Phycology', 'Phylosophy', 'Sociology', 'English Literature'],
}

const AddResourcesStory: ComponentStory<typeof AddResources> = args => <AddResources {...args} />

export const Default = AddResourcesStory.bind({})
Default.args = AddResourcesStoryProps

export default meta

import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AddToCollections, AddToCollectionsProps } from './AddToCollections'

const meta: ComponentMeta<typeof AddToCollections> = {
  title: 'Pages/New Resource/Upload Resource',
  component: AddToCollections,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AddToCollectionsStoryProps', 'Default'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const AddToCollectionsStoryProps: AddToCollectionsProps = {
  setSearchText: action('setSearchText'),
  previousStep: action('previousStep'),
  nextStep: action('nextStep'),
  step: 'AddToCollectionsStep',
  collections: ['Education', 'Biology', 'Algebra', 'Phycology', 'Phylosophy', 'Sociology', 'English Literature']
}

const AddToCollectionsStory: ComponentStory<typeof AddToCollections> = args => <AddToCollections {...args} />

export const Default = AddToCollectionsStory.bind({})
Default.args = AddToCollectionsStoryProps

export default meta

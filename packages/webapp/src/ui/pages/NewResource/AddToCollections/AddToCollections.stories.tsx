import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { NewResourceFormValues } from '../types'
import { AddToCollections, AddToCollectionsProps } from './AddToCollections'

const meta: ComponentMeta<typeof AddToCollections> = {
  title: 'Pages/New Resource/Upload Resource',
  component: AddToCollections,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AddToCollectionsStoryProps'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const AddToCollectionsStoryProps: AddToCollectionsProps = {
  previousStep: action('previousStep'),
  nextStep: action('nextStep'),
  formBag: SBFormikBag<NewResourceFormValues>({
    addToCollections: [],
    category: '',
    content: '',
    contentType: 'Link',
    description: '',
    format: '',
    image: '',
    language: '',
    level: '',
    license: '',
    name: '',
    originalDate: new Date(),
    title: '',
    type: '',
  }),
  imageUrl: '',
  step: 'AddToCollectionsStep',
  collections: ['Education', 'Biology', 'Algebra', 'Phycology', 'Phylosophy', 'Sociology', 'English Literature']
}

const AddToCollectionsStory: ComponentStory<typeof AddToCollections> = args => <AddToCollections {...args} />

export const Default = AddToCollectionsStory.bind({})
Default.args = AddToCollectionsStoryProps

export default meta

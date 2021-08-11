import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { CategoriesDropdown, LicenseDropdown } from '../FieldsData'
import { NewResourceFormValues } from '../types'
import { CreateCollection, CreateCollectionProps } from './CreateCollection'

const meta: ComponentMeta<typeof CreateCollection> = {
  title: 'Pages/New Resource/Upload Resource',
  component: CreateCollection,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['CreateCollectionStoryProps', 'Default'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const CreateCollectionStoryProps: CreateCollectionProps = {
  deleteContent: action('deleteContent'),
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
    originalDateMonth: '',
    originalDateYear: '',
    title: '',
    type: '',
  }),
  imageUrl: '',
  state: 'ChooseResource',
  step: 'CreateCollectionStep',
  categories: CategoriesDropdown,
  licenses: LicenseDropdown,
}

const CreateCollectionStory: ComponentStory<typeof CreateCollection> = args => <CreateCollection {...args} />

export const Default = CreateCollectionStory.bind({})
Default.args = CreateCollectionStoryProps

export default meta

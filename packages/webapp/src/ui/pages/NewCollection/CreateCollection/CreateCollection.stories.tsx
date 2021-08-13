import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { CategoriesDropdown } from '../FieldsData'
import { NewCollectionFormValues } from '../types'
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
  nextStep: action('nextStep'),
  formBag: SBFormikBag<NewCollectionFormValues>({
    resources: [],
    category: '',
    description: '',
    image: '',
    name: '',
    title: '',
  }),
  imageUrl: '',
  step: 'CreateCollectionStep',
  categories: CategoriesDropdown,
}

const CreateCollectionStory: ComponentStory<typeof CreateCollection> = args => <CreateCollection {...args} />

export const Default = CreateCollectionStory.bind({})
Default.args = CreateCollectionStoryProps

export default meta

import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { CategoriesDropdown, LicenseDropdown } from '../FieldsData'
import { NewResourceFormValues } from '../types'
import { UploadResource, UploadResourceProps } from './UploadResource'

const meta: ComponentMeta<typeof UploadResource> = {
  title: 'Pages/New Resource/Upload Resource',
  component: UploadResource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['UploadResourceStoryProps', 'Default'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const UploadResourceStoryProps: UploadResourceProps = {
  deleteContent: action('deleteContent'),
  nextStep: action('nextStep'),
  formBag: SBFormikBag<NewResourceFormValues>({
    collections: [],
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
  step: 'UploadResourceStep',
  categories: CategoriesDropdown,
  licenses: LicenseDropdown,
}

const UploadResourceStory: ComponentStory<typeof UploadResource> = args => <UploadResource {...args} />

export const Default = UploadResourceStory.bind({})
Default.args = UploadResourceStoryProps

export default meta

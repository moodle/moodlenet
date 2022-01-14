import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../../../lib/storybook/SBFormikBag'
import { LicenseDropdown, VisibilityDropdown } from '../FieldsData'
import { CategoriesDropdown } from '../storiesData'
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
    (Story) => (
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
    visibility: '',
    category: '',
    content: '',
    contentType: 'Link',
    description: '',
    format: '',
    image: '',
    imageUrl: '',
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
  categories: { opts: CategoriesDropdown, selected: [] },
  licenses: LicenseDropdown,
  visibility: VisibilityDropdown,
}

const UploadResourceStory: ComponentStory<typeof UploadResource> = (args) => (
  <UploadResource {...args} />
)

export const Default = UploadResourceStory.bind({})
Default.args = UploadResourceStoryProps

export default meta

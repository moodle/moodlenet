import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import {
  CategoriesTextOptionProps,
  LicenseIconTextOptionProps,
} from './storiesData'
import { UploadResource, UploadResourceProps } from './UploadResource'
const meta: ComponentMeta<typeof UploadResource> = {
  title: 'Pages/New Resource/Upload Resource',
  component: UploadResource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['UploadResourceStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const UploadResourceStoryProps: UploadResourceProps = {
  fileMaxSize: 50 * 1024 * 1024,
  categories: {
    opts: CategoriesTextOptionProps,
    selected: CategoriesTextOptionProps[2],
  },
  licenses: {
    opts: LicenseIconTextOptionProps,
    selected: LicenseIconTextOptionProps[3],
  },
  setCategoryFilter: action('search Category'),
}

export default meta

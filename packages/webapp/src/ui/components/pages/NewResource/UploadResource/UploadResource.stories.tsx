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
  categories: {
    opts: CategoriesTextOptionProps,
    selected: CategoriesTextOptionProps[2],
  },
  licenses: {
    opts: LicenseIconTextOptionProps,
    selected: LicenseIconTextOptionProps[3],
  },
}

export default meta

import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { LicenseIconTextOptionProps } from 'components/organisms/MainCollectionCard/storiesData.js'
import { SortBy, SortByProps } from './SortBy.js'

const meta: ComponentMeta<typeof SortBy> = {
  title: 'Atoms/SortBy',
  component: SortBy,
  excludeStories: ['useSortByStoryProps'],
}

type SortByStory = ComponentStory<typeof SortBy>

export const useSortByStoryProps = (overrides?: Partial<SortByProps>): SortByProps => {
  const license = 'CC-0 (Public domain)'
  return {
    license: license,
    licenses: {
      opts: LicenseIconTextOptionProps,
      selected: LicenseIconTextOptionProps.find(({ value }) => value === license),
    },
    editLicense: action('editLicense'),
    ...overrides,
  }
}

export const Default: SortByStory = () => {
  const props = useSortByStoryProps({})
  return <SortBy {...props} />
}

// export const Props: SortByProps = {
//   license: 'license',
//   licenses: {
//     opts: SubjectsTextOptionProps,
//     selected: SubjectsTextOptionProps.find(({ value }) => value === 'license'),
//   },
//   canEdit: true,
//   isEditing: true,
//   isSubmitting: false,
//   shouldShowErrors: false,
//   editSubject: () => Promise.resolve(),
//   validationSchema: licenseValidationSchema,
//   setCategoryFilter: action('setCategoryFilter'),
// }

// export const Owner = SortByStory.bind({})
// Owner.args = Props

export default meta

import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { LicenseIconTextOptionProps } from '../../../../common/data.js'
import { licenseValidationSchema } from '../../../../common/validationSchema.js'
import LicenseField, { LicenseFieldProps } from './LicenseField.js'

const meta: ComponentMeta<typeof LicenseField> = {
  title: 'Atoms/LicenseField',
  component: LicenseField,
  excludeStories: ['useLicenseFieldStoryProps'],
}

type LicenseFieldStory = ComponentStory<typeof LicenseField>

export const useLicenseFieldStoryProps = (
  overrides?: Partial<LicenseFieldProps>,
): LicenseFieldProps => {
  const license = 'CC-0 (Public domain)'
  return {
    license: license,
    licenses: {
      opts: LicenseIconTextOptionProps,
      selected: LicenseIconTextOptionProps.find(({ value }) => value === license),
    },
    canEdit: true,
    isEditing: true,
    shouldShowErrors: false,
    editLicense: action('editLicense'),
    contentType: 'file',
    validationSchema: licenseValidationSchema,
    ...overrides,
  }
}

export const Default: LicenseFieldStory = () => {
  const props = useLicenseFieldStoryProps({})
  return <LicenseField {...props} />
}

// export const Props: LicenseFieldProps = {
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

// export const Owner = LicenseFieldStory.bind({})
// Owner.args = Props

export default meta

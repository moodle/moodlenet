import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'

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
  return {
    license: '',
    canEdit: true,
    shouldShowErrors: false,
    editLicense: action('editLicense'),
    ...overrides,
  }
}

export const Default: LicenseFieldStory = () => {
  const props = useLicenseFieldStoryProps({})
  return <LicenseField {...props} />
}

export default meta

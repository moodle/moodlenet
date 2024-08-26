import type { OrganizationData } from '@moodlenet/organization/common'
import { action } from '@storybook/addon-actions'
import type { FC } from 'react'
import type { SchemaOf } from 'yup'
import { object, string } from 'yup'
import type { UserSettingsItem } from '../UserSettings.js'
import type { AdvancedProps } from './Advanced.js'
import { Advanced, AdvancedMenu } from './Advanced.js'

export const validationSchema: SchemaOf<OrganizationData> = object({
  instanceName: string().max(160).min(3).required(/* t */ `Please provide an instance name`),
  landingTitle: string().max(160).min(3).required(/* t */ `Please provide a landing title`),
  landingSubtitle: string().max(4096).min(3).required(/* t */ `Please provide a landing subtitle`),
  locationAddress: string().max(160).min(3).required(/* t */ `Please provide a location address`),
  locationUrl: string()
    .max(50)
    .min(3)
    .url(/* t */ `Please provide a valid URL`)
    .required(/* t */ `Please provide a location URL`),
  copyright: string().max(160).required(/* t */ `Please provide a location address`),
})

export const useAdvancedStoryProps = (overrides?: {
  editFormValues?: Partial<OrganizationData>
  props?: Partial<AdvancedProps>
}): AdvancedProps => {
  return {
    instanceName: 'MoodleNet',
    deleteAccount: action('Deleting account'),
    deleteAccountSuccess: false,
    mainColumnItems: [],
    // updateExtensions: action('Updating extensions'),
    // updateSuccess: true,
    ...overrides?.props,
  }
}

const AdvancedItem: FC = () => <Advanced {...useAdvancedStoryProps()} />
export const useElements = (): UserSettingsItem => {
  return {
    Menu: AdvancedMenu,
    Content: AdvancedItem,
    key: 'content-advanced',
  }
}

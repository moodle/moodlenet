import type { OrganizationData } from '@moodlenet/organization/common'
import { action } from '@storybook/addon-actions'
import type { FC } from 'react'
import type { SchemaOf } from 'yup'
import { object, string } from 'yup'
import type { UserSettingsItem } from '../UserSettings.js'
import type { GeneralProps } from './General.js'
import { General, GeneralMenu } from './General.js'

export const validationSchema: SchemaOf<OrganizationData> = object({
  instanceName: string().max(160).min(3).required(/* t */ `Please provide an instance name`),
  landingTitle: string().max(160).min(3).required(/* t */ `Please provide a landing title`),
  landingSubtitle: string().max(4096).min(3).required(/* t */ `Please provide a landing subtitle`),
})

export const useGeneralStoryProps = (overrides?: {
  editFormValues?: Partial<OrganizationData>
  props?: Partial<GeneralProps>
}): GeneralProps => {
  return {
    data: {
      email: 'youremail@nice.com',
      password: 'yourpassword',
    },
    editData: action('edit data'),
    emailChangedSuccess: false,
    passwordChangedSuccess: false,
    saveSuccess: false,
    deleteAccount: action('delete account'),
    deleteAccountSuccess: false,
    mainColumnItems: [],
    // updateExtensions: action('Updating extensions'),
    // updateSuccess: true,
    ...overrides?.props,
  }
}

const GeneralItem: FC = () => <General {...useGeneralStoryProps()} />
export const useElements = (): UserSettingsItem => {
  return {
    Menu: GeneralMenu,
    Content: GeneralItem,
    key: 'content-general',
  }
}

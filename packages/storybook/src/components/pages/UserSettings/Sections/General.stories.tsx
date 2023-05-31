import type { SimpleEmailUserSettingsProps } from '@moodlenet/simple-email-auth/ui'
import { SimpleEmailUserSettings } from '@moodlenet/simple-email-auth/ui'
import type { GeneralProps, UserSettingsItem } from '@moodlenet/web-user/ui'
import { General, GeneralMenu } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import type { FC } from 'react'

export const useUserSettingsGeneralStoryProps = (overrides?: {
  props?: Partial<GeneralProps>
}): GeneralProps => {
  const simpleEmailUserSettingsProps: SimpleEmailUserSettingsProps = {
    data: {
      email: 'myemail@domain.com',
      password: 'mypassword',
    },
    emailChangedSuccess: false,
    passwordChangedSuccess: false,
    editData: action('edit data'),
  }
  return {
    deleteAccount: action('delete account'),
    deleteAccountSuccess: false,
    mainColumnItems: [
      {
        Item: () => <SimpleEmailUserSettings {...simpleEmailUserSettingsProps} />,
        key: 'simple-email-auth',
      },
    ],
    // updateExtensions: action('Updating extensions'),
    // updateSuccess: true,
    ...overrides?.props,
  }
}

const UserSettingsGeneralItem: FC = () => <General {...useUserSettingsGeneralStoryProps()} />
export const useUserSettingsGeneralElements = (): UserSettingsItem => {
  return {
    Menu: GeneralMenu,
    Content: UserSettingsGeneralItem,
    key: 'content-general',
  }
}

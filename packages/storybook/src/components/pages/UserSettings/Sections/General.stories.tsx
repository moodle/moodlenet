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
      password: 'mypassword',
    },
    passwordChangedSuccess: false,
    editData: action('edit data'),
  }
  return {
    mainColumnItems: [
      {
        Item: () => <SimpleEmailUserSettings {...simpleEmailUserSettingsProps} />,
        key: 'simple-email-auth',
      },
    ],
    userId: 'john-cake-21321312',
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

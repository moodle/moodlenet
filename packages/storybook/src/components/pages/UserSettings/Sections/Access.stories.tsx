// import type { PassportAuthUserSettingsProps } from '@moodlenet/passport-auth/ui'
// import { PassportAuthUserSettings } from '@moodlenet/passport-auth/ui'
// import type { AccessProps, UserSettingsItem } from '@moodlenet/web-user/ui'
// import { Access, AccessMenu } from '@moodlenet/web-user/ui'
// import { action } from '@storybook/addon-actions'
// import type { FC } from 'react'

// export const useUserSettingsAccessStoryProps = (overrides?: {
//   props?: Partial<AccessProps>
// }): AccessProps => {
//   const PassportAuthUserSettingsProps: PassportAuthUserSettingsProps = {
//     data: {
//       email: 'myemail@domain.com',
//       password: 'mypassword',
//     },
//     emailChangedSuccess: false,
//     passwordChangedSuccess: false,
//     editData: action('edit data'),
//   }
//   return {
//     deleteAccount: action('delete account'),
//     deleteAccountSuccess: false,
//     mainColumnItems: [
//       {
//         Item: () => <PassportAuthUserSettings {...PassportAuthUserSettingsProps} />,
//         key: 'passport-auth',
//       },
//     ],
//     // updateExtensions: action('Updating extensions'),
//     // updateSuccess: true,
//     ...overrides?.props,
//   }
// }

// const UserSettingsAccessItem: FC = () => <Access {...useUserSettingsAccessStoryProps()} />
// export const useUserSettingsAccessElements = (): UserSettingsItem => {
//   return {
//     Menu: AccessMenu,
//     Content: UserSettingsAccessItem,
//     key: 'content-Access',
//   }
// }

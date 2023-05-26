// import { UserSettings as PassportAuthSettins } from '@moodlenet/passport-auth/ui'
import { AdvancedStories, GeneralStories } from '@moodlenet/web-user/stories'
import type { UserSettingsProps } from '@moodlenet/web-user/ui'
import { UserSettings } from '@moodlenet/web-user/ui'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { MainLayoutLoggedInStoryProps } from '../../layout/MainLayout/MainLayout.stories.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof UserSettings> = {
  title: 'Pages/Settings',
  component: UserSettings,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['UserSettingsDefaultStoryProps'],
}

export const UserSettingsDefaultStoryProps = (): UserSettingsProps => {
  return {
    settingsItems: [
      {
        Menu: GeneralStories.useElements().Menu,
        Content: GeneralStories.useElements().Content,
        key: 'general',
      },
      {
        Menu: AdvancedStories.useElements().Menu,
        Content: AdvancedStories.useElements().Content,
        key: 'advanced',
      },

      // {
      //   Menu: ManageExtensionsStories.useElements().Menu,
      //   Content: ManageExtensionsStories.useElements().Content,
      // },
      // { Menu: SimpleEmailAuthUserSettings.Menu, Content: SimpleEmailAuthUserSettings.Content },
      // { Menu: PassportAuthSettins.Menu, Content: PassportAuthSettins.Content },
    ],
    mainLayoutProps: MainLayoutLoggedInStoryProps,
  }
}

type UserSettingsStory = ComponentStory<typeof UserSettings>

export const Default: UserSettingsStory = () => {
  const props = {
    ...UserSettingsDefaultStoryProps(),
  }
  return <UserSettings {...props} />
}

export default meta

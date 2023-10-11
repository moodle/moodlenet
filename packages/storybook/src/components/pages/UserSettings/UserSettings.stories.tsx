// import { UserSettings as PassportAuthSettins } from '@moodlenet/passport-auth/ui'
import { AdvancedStories } from '@moodlenet/web-user/stories'
import type { UserSettingsProps } from '@moodlenet/web-user/ui'
import { UserSettings } from '@moodlenet/web-user/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { MainLayoutLoggedInStoryProps } from '../../layout/MainLayout/MainLayout.stories.js'
import { useUserSettingsGeneralElements } from './Sections/General.stories.props.js'
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
        Menu: useUserSettingsGeneralElements().Menu,
        Content: useUserSettingsGeneralElements().Content,
        key: 'general',
      },
      // {
      //   Menu: useUserSettingsAccessElements().Menu,
      //   Content: useUserSettingsAccessElements().Content,
      //   key: 'access',
      // },
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

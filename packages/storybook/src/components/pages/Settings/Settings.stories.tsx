// import { Settings as PassportAuthSettins } from '@moodlenet/passport-auth/ui'
import { ExtensionsStories } from '@moodlenet/extensions-manager/stories'
import { AdvancedStories, AppearanceStories, GeneralStories } from '@moodlenet/react-app/stories'
import type { SettingsProps } from '@moodlenet/react-app/ui'
import { Settings } from '@moodlenet/react-app/ui'
import { UsersStories } from '@moodlenet/web-user/stories'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { MainLayoutLoggedInStoryProps } from '../../layout/MainLayout/MainLayout.stories.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Settings> = {
  title: 'Pages/Settings',
  component: Settings,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['SettingsDefaultStoryProps'],
}

export const SettingsDefaultStoryProps = (): SettingsProps => {
  return {
    settingsItems: [
      {
        Menu: GeneralStories.useElements().Menu,
        Content: GeneralStories.useElements().Content,
      },
      {
        Menu: AppearanceStories.useElements().Menu,
        Content: AppearanceStories.useElements().Content,
      },
      {
        Menu: ExtensionsStories.useElements().Menu,
        Content: ExtensionsStories.useElements().Content,
      },
      // {
      //   Menu: ManageExtensionsStories.useElements().Menu,
      //   Content: ManageExtensionsStories.useElements().Content,
      // },
      {
        Menu: UsersStories.useElements().Menu,
        Content: UsersStories.useElements().Content,
      },
      {
        Menu: AdvancedStories.useElements().Menu,
        Content: AdvancedStories.useElements().Content,
      },
      // { Menu: SimpleEmailAuthSettings.Menu, Content: SimpleEmailAuthSettings.Content },
      // { Menu: PassportAuthSettins.Menu, Content: PassportAuthSettins.Content },
    ],
    mainLayoutProps: MainLayoutLoggedInStoryProps,
  }
}

type SettingsStory = ComponentStory<typeof Settings>

export const Default: SettingsStory = () => {
  const props = {
    ...SettingsDefaultStoryProps(),
  }
  return <Settings {...props} />
}

export default meta

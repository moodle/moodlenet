// import { AdminSettings as PassportAuthSettins } from '@moodlenet/passport-auth/ui'
import { ExtensionsStories } from '@moodlenet/extensions-manager/stories'
import { AppearanceStories, GeneralStories } from '@moodlenet/react-app/stories'
import type { AdminSettingsProps } from '@moodlenet/react-app/ui'
import { AdminSettings } from '@moodlenet/react-app/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { MainLayoutLoggedInStoryProps } from '../../layout/MainLayout/MainLayout.stories'
import { useModerationAdminSettingsElements } from './Moderation.stories.props'
import { useUserAdminSettingsElements } from './Users.stories.props'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof AdminSettings> = {
  title: 'Pages/Admin',
  component: AdminSettings,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['AdminSettingsDefaultStoryProps'],
}

export const AdminSettingsDefaultStoryProps = (): AdminSettingsProps => {
  return {
    settingsItems: [
      {
        Menu: GeneralStories.useElements().Menu,
        Content: GeneralStories.useElements().Content,
        key: 'general',
      },
      {
        Menu: AppearanceStories.useElements().Menu,
        Content: AppearanceStories.useElements().Content,
        key: 'appearance',
      },
      {
        Menu: ExtensionsStories.useElements().Menu,
        Content: ExtensionsStories.useElements().Content,
        key: 'extensions',
      },
      // {
      //   Menu: ManageExtensionsStories.useElements().Menu,
      //   Content: ManageExtensionsStories.useElements().Content,
      // },
      {
        Menu: useUserAdminSettingsElements().Menu,
        Content: useUserAdminSettingsElements().Content,
        key: 'users',
      },
      {
        Menu: useModerationAdminSettingsElements().Menu,
        Content: useModerationAdminSettingsElements().Content,
        key: 'moderation',
      },
      // {
      //   Menu: AdvancedStories.useElements().Menu,
      //   Content: AdvancedStories.useElements().Content,
      //   key: 'advanced',
      // },
      // { Menu: SimpleEmailAuthAdminSettings.Menu, Content: SimpleEmailAuthAdminSettings.Content },
      // { Menu: PassportAuthSettins.Menu, Content: PassportAuthSettins.Content },
    ],
    mainLayoutProps: MainLayoutLoggedInStoryProps,
  }
}

type AdminSettingsStory = ComponentStory<typeof AdminSettings>

export const Default: AdminSettingsStory = () => {
  const props = {
    ...AdminSettingsDefaultStoryProps(),
  }
  return <AdminSettings {...props} />
}

export default meta

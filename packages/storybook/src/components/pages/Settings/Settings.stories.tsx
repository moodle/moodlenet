// import { Settings as PassportAuthSettins } from '@moodlenet/passport-auth/ui'
import { AppearanceStories, GeneralStories } from '@moodlenet/react-app/stories'
import { Settings, SettingsProps } from '@moodlenet/react-app/ui'

import { Settings as SimpleEmailAuthSettins } from '@moodlenet/simple-email-auth/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
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
      { Menu: SimpleEmailAuthSettins.Menu, Content: SimpleEmailAuthSettins.Content },
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

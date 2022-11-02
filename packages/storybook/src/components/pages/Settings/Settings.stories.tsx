import { Settings, SettingsProps } from '@moodlenet/react-app/ui.mjs'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../layout/MainLayout/MainLayout.stories.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Settings> = {
  title: 'Pages/Settings',
  component: Settings,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['SettingsLoggedOutStoryProps', 'SettingsLoggedInStoryProps'],
}

export const SettingsLoggedOutStoryProps: SettingsProps = {
  mainLayoutProps: MainLayoutLoggedOutStoryProps,
  settingsItems: [],
}

export const SettingsLoggedInStoryProps: SettingsProps = {
  ...SettingsLoggedOutStoryProps,
  mainLayoutProps: MainLayoutLoggedInStoryProps,
}

type SettingsStory = ComponentStory<typeof Settings>

export const LoggedOut: SettingsStory = () => {
  const props = {
    ...SettingsLoggedOutStoryProps,
  }
  return <Settings {...props} />
}

export const LoggedIn: SettingsStory = () => {
  const props = {
    ...SettingsLoggedInStoryProps,
  }
  return <Settings {...props} />
}

export default meta

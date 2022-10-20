import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MainLayoutStories } from '../../../../stories.mjs'
import { Settings, SettingsProps } from './Settings.js'
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
  mainLayoutProps: MainLayoutStories.MainLayoutLoggedOutStoryProps,
  settingsItems: [],
}

export const SettingsLoggedInStoryProps: SettingsProps = {
  ...SettingsLoggedOutStoryProps,
  mainLayoutProps: MainLayoutStories.MainLayoutLoggedInStoryProps,
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

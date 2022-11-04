import { Settings, SettingsProps } from '@moodlenet/react-app/ui'
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

export const SettingsDefaultStoryProps: SettingsProps = {
  settingsItems: [],
  mainLayoutProps: MainLayoutLoggedInStoryProps,
}

type SettingsStory = ComponentStory<typeof Settings>

export const Default: SettingsStory = () => {
  const props = {
    ...SettingsDefaultStoryProps,
  }
  return <Settings {...props} />
}

export default meta

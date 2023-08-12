import type { ComponentMeta, ComponentStory } from '@storybook/react'

import type { MaintenanceProps } from '@moodlenet/react-app/ui'
import { Maintenance } from '@moodlenet/react-app/ui'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../../layout/MainLayout/MainLayout.stories.js'

const meta: ComponentMeta<typeof Maintenance> = {
  title: 'Pages/Extra/Maintenance',
  component: Maintenance,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'MaintenanceStoryProps',
    'MaintenanceLoggedOutStoryProps',
    'MaintenanceLoggedInStoryProps',
  ],
}

type MaintenanceStory = ComponentStory<typeof Maintenance>

export const MaintenanceLoggedOutStoryProps: MaintenanceProps = {
  mainLayoutProps: MainLayoutLoggedOutStoryProps,
}

export const MaintenanceLoggedInStoryProps: MaintenanceProps = {
  mainLayoutProps: MainLayoutLoggedInStoryProps,
}

export const LoggedOut: MaintenanceStory = () => {
  const props = {
    ...MaintenanceLoggedOutStoryProps,
  }

  return <Maintenance {...props} />
}

export const LoggedIn: MaintenanceStory = () => {
  const props = {
    ...MaintenanceLoggedInStoryProps,
  }

  return <Maintenance {...props} />
}

export default meta

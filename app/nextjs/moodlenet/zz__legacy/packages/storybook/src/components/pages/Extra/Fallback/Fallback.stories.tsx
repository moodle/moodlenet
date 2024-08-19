import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'

import type { FallbackProps } from '@moodlenet/react-app/ui'
import { Fallback } from '@moodlenet/react-app/ui'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../../layout/MainLayout/MainLayout.stories.js'

const meta: ComponentMeta<typeof Fallback> = {
  title: 'Pages/Extra/Fallback',
  component: Fallback,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'FallbackStoryProps',
    'FallbackLoggedOutStoryProps',
    'FallbackLoggedInStoryProps',
  ],
}

type FallbackStory = ComponentStory<typeof Fallback>

export const FallbackLoggedOutStoryProps: FallbackProps = {
  mainLayoutProps: MainLayoutLoggedOutStoryProps,
}

export const FallbackLoggedInStoryProps: FallbackProps = {
  mainLayoutProps: MainLayoutLoggedInStoryProps,
}

export const LoggedOut: FallbackStory = () => {
  const props = {
    ...FallbackLoggedOutStoryProps,
  }

  return <Fallback {...props} />
}

export const LoggedIn: FallbackStory = () => {
  const props = {
    ...FallbackLoggedInStoryProps,
  }

  return <Fallback {...props} />
}

export default meta

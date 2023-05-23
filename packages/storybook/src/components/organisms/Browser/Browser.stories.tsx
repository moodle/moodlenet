import type { BrowserProps } from '@moodlenet/react-app/ui'
import { Browser } from '@moodlenet/react-app/ui'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { useBrowserStoryProps } from './BrowserProps.stories.js'

const meta: ComponentMeta<typeof Browser> = {
  title: 'Organisms/Browser',
  component: Browser,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'BrowserStoryProps',
    'BrowserLoggedOutStoryProps',
    'BrowserLoggedInStoryProps',
    'BrowserFollowingStoryProps',
  ],
}

type BrowserStory = ComponentStory<typeof Browser>

export const BrowserLoggedInStoryProps: BrowserProps = {
  mainColumnItems: [],
}

export const BrowserFollowingStoryProps: BrowserProps = {
  ...BrowserLoggedInStoryProps,
}

export const LoggedOut: BrowserStory = () => {
  const props = useBrowserStoryProps({ isAuthenticated: false })
  return <Browser {...props} />
}

// export const LoggedOut = BrowserStory.bind({})
// LoggedOut.args = useBrowserLoggedOutStoryProps()

// export const LoggedIn = BrowserStory.bind({})
// LoggedIn.args = BrowserLoggedInStoryProps

// export const Following = BrowserStory.bind({})
// Following.args = BrowserFollowingStoryProps

export default meta

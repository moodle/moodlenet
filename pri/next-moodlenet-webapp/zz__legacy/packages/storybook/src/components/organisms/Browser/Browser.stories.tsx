import type { BrowserProps } from '@moodlenet/react-app/ui'
import { Browser } from '@moodlenet/react-app/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { useBrowserStoryProps } from './BrowserProps.stories.props'

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

// export const LoggedOut: typeof BrowserStory = BrowserStory.bind({})
// LoggedOut.args = useBrowserLoggedOutStoryProps()

// export const LoggedIn: typeof BrowserStory = BrowserStory.bind({})
// LoggedIn.args = BrowserLoggedInStoryProps

// export const Following: typeof BrowserStory = BrowserStory.bind({})
// Following.args = BrowserFollowingStoryProps

export default meta

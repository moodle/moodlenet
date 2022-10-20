import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MainLayoutStories } from '../../../../stories.mjs'
import { Landing, LandingProps } from './Landing.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Landing> = {
  title: 'Pages/Landing',
  component: Landing,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['LandingLoggedOutStoryProps', 'LandingLoggedInStoryProps'],
}

export const LandingLoggedOutStoryProps: LandingProps = {
  mainLayoutProps: MainLayoutStories.MainLayoutLoggedOutStoryProps,
  title: 'Find, share and curate open educational resources',
  subtitle: 'Search for resources, subjects, collections or people',
}

export const LandingLoggedInStoryProps: LandingProps = {
  ...LandingLoggedOutStoryProps,
  mainLayoutProps: MainLayoutStories.MainLayoutLoggedInStoryProps,
}

type LandingStory = ComponentStory<typeof Landing>

export const LoggedOut: LandingStory = () => {
  const props = {
    ...LandingLoggedOutStoryProps,
  }
  return <Landing {...props} />
}

export const LoggedIn: LandingStory = () => {
  const props = {
    ...LandingLoggedInStoryProps,
  }
  return <Landing {...props} />
}

export default meta

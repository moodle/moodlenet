import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import { Landing } from '../Landing/Landing'
import { LandingStoryProps } from '../Landing/Landing.stories'
import { Profile } from '../Profile/Profile'
import { ProfileStoryProps } from '../Profile/Profile.stories'
import { LoggedIn, LoggedInProps } from './LoggedIn'

const meta: ComponentMeta<typeof LoggedIn> = {
  title: 'Pages/LoggedIn',
  component: LoggedIn,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['LoggedInProfileStoryProps', 'LoggedInLandingStoryProps'],
}

const LoggedInStory: ComponentStory<typeof LoggedIn> = args => <LoggedIn {...args} />

export const LoggedInProfileStoryProps: LoggedInProps = {
  headerProps: HeaderStoryProps,
  subheaderProps: SubHeaderStoryProps,
  view: Profile({...ProfileStoryProps})
}

export const ProfilePage = LoggedInStory.bind({})
ProfilePage.args = LoggedInProfileStoryProps

export const LoggedInLandingStoryProps: LoggedInProps = {
  headerProps: HeaderStoryProps,
  subheaderProps: SubHeaderStoryProps,
  view: Landing({...LandingStoryProps})
}

export const LandingPage = LoggedInStory.bind({})
LandingPage.args = LoggedInLandingStoryProps


export default meta

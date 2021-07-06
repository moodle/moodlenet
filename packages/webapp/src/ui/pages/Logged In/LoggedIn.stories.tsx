import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import { Profile } from '../Profile/Profile'
import { ProfileStoryProps } from '../Profile/Profile.stories'
import { LoggedIn, LoggedInProps } from './LoggedIn'

const meta: ComponentMeta<typeof LoggedIn> = {
  title: 'Pages/LoggedIn',
  component: LoggedIn,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['LoggedInStoryProps'],
}

const LoggedInStory: ComponentStory<typeof LoggedIn> = args => <LoggedIn {...args} />

export const LoggedInStoryProps: LoggedInProps = {
  headerProps: HeaderStoryProps,
  subheaderProps: SubHeaderStoryProps,
  view: Profile({...ProfileStoryProps})
}

export const ProfilePage = LoggedInStory.bind({})
ProfilePage.args = LoggedInStoryProps

export const LandingPage = LoggedInStory.bind({})
LandingPage.args = LoggedInStoryProps


export default meta

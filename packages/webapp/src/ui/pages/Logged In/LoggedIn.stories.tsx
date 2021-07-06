import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
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
  profileProps: ProfileStoryProps
}

export const Default = LoggedInStory.bind({})
Default.args = LoggedInStoryProps

export default meta

import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Landing } from '../Landing/Landing'
import { LandingStoryProps } from '../Landing/Landing.stories'
import { Profile } from '../Profile/Profile'
import { ProfileStoryProps } from '../Profile/Profile.stories'
import { Access, AccessProps } from './Access'
import { AccessHeaderStoryProps } from './AccessHeader/AccessHeader.stories'

const meta: ComponentMeta<typeof Access> = {
  title: 'Pages/Access',
  component: Access,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AccessProfileStoryProps', 'AccessLandingStoryProps', 'ProfilePage', 'LandingPage'],
}

const AccessStory: ComponentStory<typeof Access> = args => <Access {...args} />

export const AccessProfileStoryProps: AccessProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  view: Profile({...ProfileStoryProps})
}

export const ProfilePage = AccessStory.bind({})
ProfilePage.args = AccessProfileStoryProps
ProfilePage.parameters = {layout: 'fullscreen'}

export const AccessLandingStoryProps: AccessProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  view: Landing({...LandingStoryProps})
}

export const LandingPage = AccessStory.bind({})
LandingPage.args = AccessLandingStoryProps
LandingPage.parameters = {layout: 'fullscreen'}


export default meta

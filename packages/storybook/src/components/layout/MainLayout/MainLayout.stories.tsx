import { MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'

import {
  HeaderLoggedInStoryProps,
  HeaderLoggedOutOrganizationStoryProps,
  HeaderLoggedOutStoryProps,
} from '../../organisms/Header.stories.js'

const meta: ComponentMeta<typeof MainLayout> = {
  title: 'Organisms/MainLayout',
  component: MainLayout,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'MainLayoutStory',
    'MainLayoutLoggedOutStoryProps',
    'MainLayoutOrganizationLoggedOutStoryProps',
    'MainLayoutLoggedInStoryProps',
  ],
}

export const MainLayoutLoggedOutStoryProps: MainLayoutProps = {
  headerProps: HeaderLoggedOutStoryProps,
  //   homeHrpef: href('Landing/Logged In'),
  // organization: { ...MainLayoutTitleStoryProps },
}

export const MainLayoutOrganizationLoggedOutStoryProps: MainLayoutProps = {
  headerProps: HeaderLoggedOutOrganizationStoryProps,
  //   homeHref: href('Landing/Logged In'),
  // organization: { ...MainLayoutTitleOrganizationStoryProps },
}

export const MainLayoutLoggedInStoryProps: MainLayoutProps = {
  headerProps: HeaderLoggedInStoryProps,
  //   homeHref: href('Landing/Logged In'),
  // organization: { ...MainLayoutTitleOrganizationStoryProps },
}

export const MainLayoutStory: ComponentStory<typeof MainLayout> = args => <MainLayout {...args} />

export const LoggedOut = MainLayoutStory.bind({})
LoggedOut.args = MainLayoutLoggedOutStoryProps

export const LoggedOutOrganization = MainLayoutStory.bind({})
LoggedOutOrganization.args = MainLayoutOrganizationLoggedOutStoryProps

export const LoggedIn = MainLayoutStory.bind({})
LoggedIn.args = MainLayoutLoggedInStoryProps

export default meta

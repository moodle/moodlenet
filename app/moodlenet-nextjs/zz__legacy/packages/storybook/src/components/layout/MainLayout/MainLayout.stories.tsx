import type { MainLayoutProps } from '@moodlenet/react-app/ui'
import { MainLayout } from '@moodlenet/react-app/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { FooterStoryProps } from '../../organisms/Footer/Footer.stories.js'

import {
  HeaderLoggedInStoryProps,
  HeaderLoggedOutOrganizationStoryProps,
  HeaderLoggedOutStoryProps,
} from '../../organisms/MainHeader/MainHeader.stories.js'

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
  footerProps: FooterStoryProps,
}

export const MainLayoutOrganizationLoggedOutStoryProps: MainLayoutProps = {
  headerProps: HeaderLoggedOutOrganizationStoryProps,
  footerProps: FooterStoryProps,
}

export const MainLayoutLoggedInStoryProps: MainLayoutProps = {
  headerProps: HeaderLoggedInStoryProps,
  footerProps: FooterStoryProps,
}

export const MainLayoutStory: ComponentStory<typeof MainLayout> = args => <MainLayout {...args} />

export const MainLayoutLoggedOut: typeof MainLayoutStory = MainLayoutStory.bind({})
MainLayoutLoggedOut.args = MainLayoutLoggedOutStoryProps

export const LoggedOutOrganization: typeof MainLayoutStory = MainLayoutStory.bind({})
LoggedOutOrganization.args = MainLayoutOrganizationLoggedOutStoryProps

export const LoggedIn: typeof MainLayoutStory = MainLayoutStory.bind({})
LoggedIn.args = MainLayoutLoggedInStoryProps

export default meta

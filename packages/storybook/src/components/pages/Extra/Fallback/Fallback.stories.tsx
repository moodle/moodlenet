import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
  Fallback,
  FallbackProps,
} from '../../../../../../react-app/src/webapp/ui/components/pages/Extra/Fallback/Fallback.js'
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

const FallbackStory: ComponentStory<typeof Fallback> = args => <Fallback {...args} />

export const FallbackLoggedOutStoryProps: FallbackProps = {
  mainLayoutProps: MainLayoutLoggedOutStoryProps,
  // headerPageTemplateProps: {
  //   headerPageProps: HeaderPageLoggedOutStoryProps,
  //   isAuthenticated: false,
  //   mainPageWrapperProps: {
  //     userAcceptsPolicies: null,
  //     cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  //   },
  // },
}

export const FallbackLoggedInStoryProps: FallbackProps = {
  mainLayoutProps: MainLayoutLoggedInStoryProps,
  // headerPageTemplateProps: {
  //   headerPageProps: HeaderPageLoggedInStoryProps,
  //   isAuthenticated: true,
  //   mainPageWrapperProps: {
  //     userAcceptsPolicies: null,
  //     cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  //   },
  // },
}

export const LoggedOut = FallbackStory.bind({})
LoggedOut.args = FallbackLoggedOutStoryProps

export const LoggedIn = FallbackStory.bind({})
LoggedIn.args = FallbackLoggedInStoryProps

export default meta

import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import {
  HeaderPageLoggedInStoryProps,
  HeaderPageLoggedOutStoryProps,
} from '../../HeaderPage/HeaderPage.stories'
import { Fallback, FallbackProps } from './Fallback'

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

const FallbackStory: ComponentStory<typeof Fallback> = (args) => (
  <Fallback {...args} />
)

export const FallbackLoggedOutStoryProps: FallbackProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedOutStoryProps,
    isAuthenticated: false,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
}

export const FallbackLoggedInStoryProps: FallbackProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
}

export const LoggedOut = FallbackStory.bind({})
LoggedOut.args = FallbackLoggedOutStoryProps

export const LoggedIn = FallbackStory.bind({})
LoggedIn.args = FallbackLoggedInStoryProps

export default meta

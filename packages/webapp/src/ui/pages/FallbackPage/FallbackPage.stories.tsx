import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../elements/link'
import { HeaderPageLoggedInStoryProps, HeaderPageLoggedOutStoryProps } from '../HeaderPage/HeaderPage.stories'
import { FallbackPage, FallbackPageProps } from './FallbackPage'

const meta: ComponentMeta<typeof FallbackPage> = {
  title: 'Pages/Fallback',
  component: FallbackPage,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['FallbackPageStoryProps', 'FallbackPageLoggedOutStoryProps', 'FallbackPageLoggedInStoryProps'],
}

const FallbackPageStory: ComponentStory<typeof FallbackPage> = args => <FallbackPage {...args} />

export const FallbackPageLoggedOutStoryProps: FallbackPageProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedOutStoryProps,
    isAuthenticated: false,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
}

export const FallbackPageLoggedInStoryProps: FallbackPageProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
}

export const LoggedOut = FallbackPageStory.bind({})
LoggedOut.args = FallbackPageLoggedOutStoryProps

export const LoggedIn = FallbackPageStory.bind({})
LoggedIn.args = FallbackPageLoggedInStoryProps

export default meta

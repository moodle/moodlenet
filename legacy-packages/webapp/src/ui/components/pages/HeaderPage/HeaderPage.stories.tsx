import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import {
  HeaderLoggedInOrganizationStoryProps,
  HeaderLoggedInStoryProps,
  HeaderLoggedOutOrganizationStoryProps,
  HeaderLoggedOutStoryProps,
} from '../../organisms/Header/Header.stories'
// import { SubHeaderStoryProps } from '../../organisms/SubHeader/SubHeader.stories'
import { HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
import HeaderPage, { HeaderPageProps } from './HeaderPage'

const meta: ComponentMeta<typeof HeaderPage> = {
  title: 'Organisms/HeaderPage',
  component: HeaderPage,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'HeaderPageLoggedInStoryProps',
    'HeaderPageLoggedOutStoryProps',
    'HeaderPageOrganizationLoggedInStoryProps',
    'HeaderPageOrganizationLoggedOutStoryProps',
    'HeaderPageTemplateLoggedOutStoryProps',
    'HeaderPageTemplateOrganizationLoggedOutStoryProps',
    'HeaderPageTemplateLoggedInStoryProps',
    'HeaderPageTemplateOrganizationLoggedInStoryProps',
    'LoggedOut',
    'LoggedIn',
    'LoggedOutOrganization',
    'LoggedInOrganization',
  ],
}

// HEADER PAGE PROPS

export const HeaderPageLoggedInStoryProps: HeaderPageProps = {
  headerProps: HeaderLoggedInStoryProps,
  // subHeaderProps: SubHeaderStoryProps,
  // isAuthenticated: true,
}

export const HeaderPageLoggedOutStoryProps: HeaderPageProps = {
  headerProps: HeaderLoggedOutStoryProps,
  // subHeaderProps: SubHeaderStoryProps,
  // isAuthenticated: false,
}

export const HeaderPageOrganizationLoggedInStoryProps: HeaderPageProps = {
  headerProps: HeaderLoggedInOrganizationStoryProps,
  // subHeaderProps: SubHeaderStoryProps,
  // isAuthenticated: true,
}

export const HeaderPageOrganizationLoggedOutStoryProps: HeaderPageProps = {
  headerProps: HeaderLoggedOutOrganizationStoryProps,
  // subHeaderProps: SubHeaderStoryProps,
  // isAuthenticated: false,
}

// HEADER PAGE TEMPLATE PROPS

export const HeaderPageTemplateLoggedOutStoryProps: HeaderPageTemplateProps = {
  isAuthenticated: false,
  headerPageProps: HeaderPageLoggedOutStoryProps,
  mainPageWrapperProps: {
    userAcceptsPolicies: () => {},
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}

export const HeaderPageTemplateOrganizationLoggedOutStoryProps: HeaderPageTemplateProps =
  {
    ...HeaderPageTemplateLoggedOutStoryProps,
    // isAuthenticated: false,
    headerPageProps: HeaderPageOrganizationLoggedOutStoryProps,
  }

export const HeaderPageTemplateLoggedInStoryProps: HeaderPageTemplateProps = {
  headerPageProps: HeaderPageLoggedInStoryProps,
  isAuthenticated: true,
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}

export const HeaderPageTemplateOrganizationLoggedInStoryProps: HeaderPageTemplateProps =
  {
    ...HeaderPageTemplateLoggedInStoryProps,
    // isAuthenticated: false,
    headerPageProps: HeaderPageOrganizationLoggedInStoryProps,
  }

// STORIES

const HeaderPageStory: ComponentStory<typeof HeaderPage> = (args) => (
  <HeaderPage {...args} />
)

export const LoggedOut = HeaderPageStory.bind({})
LoggedOut.args = HeaderPageLoggedOutStoryProps
LoggedOut.parameters = { layout: 'fullscreen' }

export const LoggedIn = HeaderPageStory.bind({})
LoggedIn.args = HeaderPageLoggedInStoryProps
LoggedIn.parameters = { layout: 'fullscreen' }

export const LoggedOutOrganization = HeaderPageStory.bind({})
LoggedOutOrganization.args = HeaderPageOrganizationLoggedOutStoryProps
LoggedOutOrganization.parameters = { layout: 'fullscreen' }

export const LoggedInOrganization = HeaderPageStory.bind({})
LoggedInOrganization.args = HeaderPageOrganizationLoggedInStoryProps
LoggedInOrganization.parameters = { layout: 'fullscreen' }

export default meta

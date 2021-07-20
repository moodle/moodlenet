import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderLoggedInOrganizationStoryProps, HeaderLoggedInStoryProps, HeaderLoggedOutOrganizationStoryProps, HeaderLoggedOutStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import HeaderPage, { HeaderPageProps } from './HeaderPage'

const meta: ComponentMeta<typeof HeaderPage> = {
  title: 'Components/Headers/HeaderPage',
  component: HeaderPage,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'HeaderPageLoggedInStoryProps', 
    'HeaderPageLoggedOutStoryProps',
    'HeaderPageLoggedInOrganizationStoryProps',
    'HeaderPageLoggedOutOrganizationStoryProps'
],
}

export const HeaderPageLoggedInStoryProps: HeaderPageProps = {
  headerProps: HeaderLoggedInStoryProps,
  subHeaderProps: SubHeaderStoryProps,
  isAuthenticated: true
}

export const HeaderPageLoggedOutStoryProps: HeaderPageProps = {
  headerProps: HeaderLoggedOutStoryProps,
  subHeaderProps: SubHeaderStoryProps,
  isAuthenticated: false
}

export const HeaderPageLoggedInOrganizationStoryProps: HeaderPageProps = {
  headerProps: HeaderLoggedInOrganizationStoryProps,
  subHeaderProps: SubHeaderStoryProps,
  isAuthenticated: true
}

export const HeaderPageLoggedOutOrganizationStoryProps: HeaderPageProps = {
  headerProps: HeaderLoggedOutOrganizationStoryProps,
  subHeaderProps: SubHeaderStoryProps,
  isAuthenticated: false
}

const HeaderPageStory: ComponentStory<typeof HeaderPage> = args => <HeaderPage {...args} />

export const LoggedOut = HeaderPageStory.bind({})
LoggedOut.args = HeaderPageLoggedOutStoryProps
LoggedOut.parameters = { layout: 'fullscreen' }

export const LoggedIn = HeaderPageStory.bind({})
LoggedIn.args = HeaderPageLoggedInStoryProps
LoggedIn.parameters = { layout: 'fullscreen' }

export const LoggedOutOrganization = HeaderPageStory.bind({})
LoggedOutOrganization.args = HeaderPageLoggedOutOrganizationStoryProps
LoggedOutOrganization.parameters = { layout: 'fullscreen' }

export const LoggedInOrganization = HeaderPageStory.bind({})
LoggedInOrganization.args = HeaderPageLoggedInOrganizationStoryProps
LoggedInOrganization.parameters = { layout: 'fullscreen' }

export default meta

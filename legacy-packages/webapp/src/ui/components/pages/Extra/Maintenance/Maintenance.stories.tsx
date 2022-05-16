import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import {
  HeaderTitleOrganizationStoryProps,
  HeaderTitleStoryProps,
} from '../../../organisms/Header/HeaderTitle/HeaderTitle.stories'
import { HeaderPageLoggedOutStoryProps } from '../../HeaderPage/HeaderPage.stories'
import { Maintenance, MaintenanceProps } from './Maintenance'

const meta: ComponentMeta<typeof Maintenance> = {
  title: 'Pages/Extra/Maintenance',
  component: Maintenance,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'MaintenanceStoryProps',
    'MaintenanceMoodleStoryProps',
    'MaintenanceOrganizationStoryProps',
  ],
}

const MaintenanceStory: ComponentStory<typeof Maintenance> = (args) => (
  <Maintenance {...args} />
)

export const MaintenanceMoodleStoryProps: MaintenanceProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedOutStoryProps,
    isAuthenticated: false,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  headerTitleProps: HeaderTitleStoryProps,
}

export const MaintenanceOrganizationStoryProps: MaintenanceProps = {
  ...MaintenanceMoodleStoryProps,
  headerTitleProps: HeaderTitleOrganizationStoryProps,
}

export const Moodle = MaintenanceStory.bind({})
Moodle.args = MaintenanceMoodleStoryProps

export const Organization = MaintenanceStory.bind({})
Organization.args = MaintenanceOrganizationStoryProps

export default meta

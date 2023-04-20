import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../../../common/lib.mjs'
import {
  HeaderTitleOrganizationStoryProps,
  HeaderTitleStoryProps,
} from '../../../atoms/HeaderTitle/HeaderTitle.stories.js'
// import { href } from '../../../../elements/link'
import { MinimalisticHeader, MinimalisticHeaderProps } from './MinimalisticHeader.js'

const meta: ComponentMeta<typeof MinimalisticHeader> = {
  title: 'Organisms/MinimalisticHeader',
  component: MinimalisticHeader,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['MinimalisticHeaderStoryProps', 'MinimalisticHeaderOrganizationStoryProps'],
}

export const MinimalisticHeaderStoryProps: MinimalisticHeaderProps = {
  page: 'login',
  loginHref: href('Pages/Access/Login/Default'),
  signupHref: href('Pages/Access/SignUp/Default'),
  headerTitleProps: HeaderTitleStoryProps,
}

export const MinimalisticHeaderOrganizationStoryProps: MinimalisticHeaderProps = {
  ...MinimalisticHeaderStoryProps,
  headerTitleProps: HeaderTitleOrganizationStoryProps,
}

const MinimalisticHeaderStory: ComponentStory<typeof MinimalisticHeader> = args => (
  <MinimalisticHeader {...args} />
)

export const Default = MinimalisticHeaderStory.bind({})
Default.args = MinimalisticHeaderStoryProps

export const Organization = MinimalisticHeaderStory.bind({})
Organization.args = MinimalisticHeaderOrganizationStoryProps

export default meta

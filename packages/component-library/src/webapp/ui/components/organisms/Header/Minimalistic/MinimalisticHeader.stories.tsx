import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  HeaderTitleOrganizationStoryProps,
  HeaderTitleStoryProps,
} from '../HeaderTitle/HeaderTitle.stories.js'
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
  //   homeHref: href('Landing/Logged In'),
  page: 'login',
  headerTitleProps: HeaderTitleStoryProps,
}

export const MinimalisticHeaderOrganizationStoryProps: MinimalisticHeaderProps = {
  page: 'login',
  //   homeHref: href('Landing/Logged In'),
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

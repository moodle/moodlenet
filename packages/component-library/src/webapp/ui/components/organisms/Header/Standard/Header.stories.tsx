import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
import {
  HeaderTitleOrganizationStoryProps,
  HeaderTitleStoryProps
} from '../HeaderTitle/HeaderTitle.stories.js'
import Header, { HeaderProps } from './Header.js'

const meta: ComponentMeta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['HeaderStoryProps', 'HeaderOrganizationStoryProps'],
}

export const HeaderStoryProps: HeaderProps = {
  //   homeHref: href('Landing/Logged In'),
  organization: { ...HeaderTitleStoryProps },
}

export const HeaderOrganizationStoryProps: HeaderProps = {
  //   homeHref: href('Landing/Logged In'),
  organization: { ...HeaderTitleOrganizationStoryProps },
}

const HeaderStory: ComponentStory<typeof Header> = args => <Header {...args} />

export const HeaderDefault = HeaderStory.bind({})
HeaderDefault.args = HeaderStoryProps

export const HeaderOrganization = HeaderStory.bind({})
HeaderOrganization.args = HeaderOrganizationStoryProps

export default meta

import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
import { HeaderTitleOrganizationStoryProps, HeaderTitleStoryProps } from '../HeaderTitle/HeaderTitle.stories.js'
import Header, { HeaderProps } from './Header.js'

const meta: ComponentMeta<typeof Header> = {
  title: 'Atoms/Header',
  component: Header,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['HeaderStoryProps', 'HeaderOrganizationStoryProps'],
}

export const HeaderStoryProps: HeaderProps = {
  //   homeHref: href('Landing/Logged In'),
  organization: {...HeaderTitleStoryProps}
}

export const HeaderOrganizationStoryProps: HeaderProps = {
  //   homeHref: href('Landing/Logged In'),
  organization: {...HeaderTitleOrganizationStoryProps}
    
}

const HeaderStory: ComponentStory<typeof Header> = args => <Header {...args} />

export const Default = HeaderStory.bind({})
Default.args = HeaderStoryProps

export const Organization = HeaderStory.bind({})
Organization.args = HeaderOrganizationStoryProps

export default meta

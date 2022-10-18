import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
import {
  HeaderOrganizationStoryProps,
  HeaderStoryProps,
} from '../../../../../../../component-library/lib/webapp/ui/components/organisms/Header/Standard/Header.stories.js'
import MainLayout, { MainLayoutProps } from './MainLayout.js'

const meta: ComponentMeta<typeof MainLayout> = {
  title: 'Organisms/MainLayout',
  component: MainLayout,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['MainLayoutStoryProps', 'MainLayoutOrganizationStoryProps'],
}

export const MainLayoutStoryProps: MainLayoutProps = {
  headerProps: HeaderStoryProps,
  //   homeHref: href('Landing/Logged In'),
  // organization: { ...MainLayoutTitleStoryProps },
}

export const MainLayoutOrganizationStoryProps: MainLayoutProps = {
  headerProps: HeaderOrganizationStoryProps,
  //   homeHref: href('Landing/Logged In'),
  // organization: { ...MainLayoutTitleOrganizationStoryProps },
}

export const MainLayoutStory: ComponentStory<typeof MainLayout> = args => <MainLayout {...args} />

export const MainLayoutDefault = MainLayoutStory.bind({})
MainLayoutDefault.args = MainLayoutStoryProps

export const MainLayoutOrganization = MainLayoutStory.bind({})
MainLayoutOrganization.args = MainLayoutOrganizationStoryProps

export default meta

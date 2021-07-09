import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import PageHeader, { PageHeaderProps } from './PageHeader'

const meta: ComponentMeta<typeof PageHeader> = {
  title: 'Pages/Header',
  component: PageHeader,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['PageHeaderStoryProps'],
}

export const PageHeaderStoryProps: PageHeaderProps = {
  headerProps: HeaderStoryProps,
  subHeaderProps: SubHeaderStoryProps
}

const PageHeaderStory: ComponentStory<typeof PageHeader> = args => <PageHeader {...args} />

export const Default = PageHeaderStory.bind({})
Default.args = PageHeaderStoryProps
Default.parameters = {layout: 'fullscreen'}

export default meta

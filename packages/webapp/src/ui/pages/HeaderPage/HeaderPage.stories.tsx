import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import HeaderPage, { HeaderPageProps } from './HeaderPage'

const meta: ComponentMeta<typeof HeaderPage> = {
  title: 'Components/Headers/HeaderPage',
  component: HeaderPage,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['HeaderPageStoryProps', 'SignedOut', 'SignedIn'],
}

export const HeaderPageStoryProps: HeaderPageProps = {
  headerProps: HeaderStoryProps,
  subHeaderProps: SubHeaderStoryProps
}

const HeaderPageStory: ComponentStory<typeof HeaderPage> = args => <HeaderPage {...args} />

export const SignedOut = HeaderPageStory.bind({})
SignedOut.args = {...HeaderPageStoryProps, headerProps: {...HeaderStoryProps, me: null}}
SignedOut.parameters = {layout: 'fullscreen'}

export const SignedIn = HeaderPageStory.bind({})
SignedIn.args = {...HeaderPageStoryProps, headerProps: {...HeaderStoryProps, me: {username: 'Juanito'}}}
SignedIn.parameters = {layout: 'fullscreen'}

export default meta

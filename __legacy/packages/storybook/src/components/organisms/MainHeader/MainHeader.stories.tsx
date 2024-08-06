import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'

// import { href } from '../../../../elements/link'
import { HeaderTitleStories } from '@moodlenet/react-app/stories'
import type { MainHeaderProps } from '@moodlenet/react-app/ui'
import { MainHeader } from '@moodlenet/react-app/ui'
import { getMainHeaderStoryProps } from './MainHeaderProps.stories.props.js'

const meta: ComponentMeta<typeof MainHeader> = {
  title: 'Organisms/MainHeader',
  component: MainHeader,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'MainHeaderStoryProps',
    'HeaderLoggedOutStoryProps',
    'HeaderLoggedOutOrganizationStoryProps',
    'HeaderLoggedInStoryProps',
  ],
  decorators: [
    Story => (
      <div style={{ alignItems: 'flex-start', width: '100%', height: '100%' }}>
        <Story />
      </div>
    ),
  ],
}

export const HeaderLoggedOutStoryProps: MainHeaderProps = {
  ...getMainHeaderStoryProps(),
  headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
}

export const HeaderLoggedOutOrganizationStoryProps: MainHeaderProps = {
  ...HeaderLoggedOutStoryProps,
  headerTitleProps: HeaderTitleStories.HeaderTitleOrganizationStoryProps,
}

export const HeaderLoggedInStoryProps: MainHeaderProps = {
  ...getMainHeaderStoryProps({ isAuthenticated: true }),
  headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
}

const HeaderStory: ComponentStory<typeof MainHeader> = args => <MainHeader {...args} />

export const LoggedOut: typeof HeaderStory = HeaderStory.bind({})
LoggedOut.args = HeaderLoggedOutStoryProps

export const OrganizationLoggedOut: typeof HeaderStory = HeaderStory.bind({})
OrganizationLoggedOut.args = HeaderLoggedOutOrganizationStoryProps

export const LoggedIn: typeof HeaderStory = HeaderStory.bind({})
LoggedIn.args = HeaderLoggedInStoryProps

export default meta

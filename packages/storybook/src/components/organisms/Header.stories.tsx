import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
import { Header, HeaderProps, UserProps } from '@moodlenet/component-library'
import { HeaderTitleStories } from '@moodlenet/component-library/stories'
import * as HeaderSettingsProps from '@moodlenet/react-app/ui'
import { HeaderStories } from '@moodlenet/web-user/stories'

const user: UserProps = {
  logout: action('logout'),
  avatarUrl:
    'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200',
  avatarMenuItems: [
    HeaderStories.HeaderProfileStoryProps,
    {
      Icon: HeaderSettingsProps.Icon,
      Text: HeaderSettingsProps.Text,
      ClassName: HeaderSettingsProps.ClassName,
      Position: HeaderSettingsProps.Position,
    },
  ],
}

const meta: ComponentMeta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
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

export const HeaderLoggedOutStoryProps: HeaderProps = {
  leftItems: [],
  centerItems: [],
  rightItems: [],
  headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
}

export const HeaderLoggedOutOrganizationStoryProps: HeaderProps = {
  ...HeaderLoggedOutStoryProps,
  headerTitleProps: HeaderTitleStories.HeaderTitleOrganizationStoryProps,
}

export const HeaderLoggedInStoryProps: HeaderProps = {
  ...HeaderLoggedOutStoryProps,
  headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
  user: user,
}

const HeaderStory: ComponentStory<typeof Header> = args => <Header {...args} />

export const LoggedOut = HeaderStory.bind({})
LoggedOut.args = HeaderLoggedOutStoryProps

export const OrganizationLoggedOut = HeaderStory.bind({})
OrganizationLoggedOut.args = HeaderLoggedOutOrganizationStoryProps

export const LoggedIn = HeaderStory.bind({})
LoggedIn.args = HeaderLoggedInStoryProps

export default meta

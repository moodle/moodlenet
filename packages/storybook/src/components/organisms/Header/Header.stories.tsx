import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
import { HeaderCollectionStories } from '@moodlenet/collection/stories'
import { HeaderResourceStories } from '@moodlenet/ed-resource/stories'
import { href } from '@moodlenet/react-app/common'
import { HeaderTitleStories } from '@moodlenet/react-app/stories'
import { MainHeader, MainHeaderProps } from '@moodlenet/react-app/ui'
import { HeaderProfileStories } from '@moodlenet/web-user/stories'

const meta: ComponentMeta<typeof MainHeader> = {
  title: 'Organisms/Header',
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

const avatarPicture =
  'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200'

const MainHeaderStoryProps: MainHeaderProps = {
  accessButtonsProps: {
    // http://localhost:6006/?path=/story/pages-resource--logged-in
    // loginHref: href('Pages/Login'),
    loginHref: href('Pages/Access/Login'),
    signupHref: href('Pages/Access/Signup'),
  },
  addMenuProps: {
    // newCollectionHref: href('Pages/NewCollection'),
    // newResourceHref: href('Pages/NewCollection'),
    menuItems: [
      HeaderResourceStories.HeaderResourceStoryProps(),
      HeaderCollectionStories.HeaderCollectionStoryProps(),
    ],
  },
  avatarMenuProps: {
    avatarUrl: avatarPicture,
    menuItems: [
      HeaderProfileStories.HeaderProfileAvatarMenuStoryProps(avatarPicture),
      HeaderProfileStories.HeaderSignoutAvatarMenuStoryProps,
    ],
  },
  headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
  isAuthenticated: false,
  leftItems: [],
  centerItems: [],
  rightItems: [],
  // logout: action('logout'),
  // avatarUrl:
  //   'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200',
  // avatarMenuItems: [
  //   HeaderStories.HeaderProfileStoryProps,
  //   {
  //     Icon: HeaderSettingsProps.Icon,
  //     Text: HeaderSettingsProps.Text,
  //     ClassName: HeaderSettingsProps.ClassName,
  //     Position: HeaderSettingsProps.Position,
  //     Path: HeaderSettingsProps.Path,
  //   },
  // ],
}

export const HeaderLoggedOutStoryProps: MainHeaderProps = {
  ...MainHeaderStoryProps,
  leftItems: [],
  centerItems: [],
  rightItems: [],
  headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
}

export const HeaderLoggedOutOrganizationStoryProps: MainHeaderProps = {
  ...HeaderLoggedOutStoryProps,
  headerTitleProps: HeaderTitleStories.HeaderTitleOrganizationStoryProps,
}

export const HeaderLoggedInStoryProps: MainHeaderProps = {
  ...HeaderLoggedOutStoryProps,
  headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
  isAuthenticated: true,
}

const HeaderStory: ComponentStory<typeof MainHeader> = args => <MainHeader {...args} />

export const LoggedOut = HeaderStory.bind({})
LoggedOut.args = HeaderLoggedOutStoryProps

export const OrganizationLoggedOut = HeaderStory.bind({})
OrganizationLoggedOut.args = HeaderLoggedOutOrganizationStoryProps

export const LoggedIn = HeaderStory.bind({})
LoggedIn.args = HeaderLoggedInStoryProps

export default meta

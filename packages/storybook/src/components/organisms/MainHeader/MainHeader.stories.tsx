import type { ComponentMeta, ComponentStory } from '@storybook/react'

// import { href } from '../../../../elements/link'
import type { AddonItem } from '@moodlenet/component-library'
import { href } from '@moodlenet/react-app/common'
import { HeaderTitleStories } from '@moodlenet/react-app/stories'
import type { MainHeaderProps } from '@moodlenet/react-app/ui'
import { MainHeader } from '@moodlenet/react-app/ui'
import { AccessButtonsStories, AvatarMenuStories } from '@moodlenet/web-user/stories'
import { AddMenu } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'

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

const AddMenuItem: AddonItem = {
  Item: () => (
    <AddMenu
      menuItems={[]}
      createCollectionProps={{ createCollection: action('create collection from add menu') }}
      createResourceProps={{ createResource: action('create resource from add menu') }}
    />
  ),
  key: 'add-menu',
}

const getRightItemsHeader = (isAuthenticated: boolean): AddonItem[] => {
  return isAuthenticated
    ? [AddMenuItem, AvatarMenuStories.AvatarMenuHeaderItem]
    : [
        ...AccessButtonsStories.getAccessButtons({
          loginHref: href('Pages/Access/Login'),
          signupHref: href('Pages/Access/Signup'),
        }),
      ]
}

const MainHeaderStoryProps: MainHeaderProps = {
  // accessButtonsProps: {
  //   // http://localhost:6006/?path=/story/pages-resource--logged-in
  //   // loginHref: href('Pages/Login'),
  //   loginHref: href('Pages/Access/Login'),
  //   signupHref: href('Pages/Access/Signup'),
  // },
  // addMenuProps: {
  //   // newCollectionHref: href('Pages/NewCollection'),
  //   // newResourceHref: href('Pages/NewCollection'),
  //   menuItems: [
  //     HeaderResourceStories.HeaderResourceStoryProps(),
  //     HeaderCollectionStories.HeaderCollectionStoryProps(),
  //   ],
  // },
  // avatarMenuProps: {
  //   avatarUrl: avatarPicture,
  //   menuItems: [
  //     HeaderProfileStories.HeaderProfileAvatarMenuStoryProps(avatarPicture),
  //     HeaderProfileStories.HeaderSignoutAvatarMenuStoryProps,
  //   ],
  // },
  headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
  // isAuthenticated: false,
  leftItems: [],
  centerItems: [],
  rightItems: [...getRightItemsHeader(false)],
  search: action('search'),
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
  headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
}

export const HeaderLoggedOutOrganizationStoryProps: MainHeaderProps = {
  ...HeaderLoggedOutStoryProps,
  headerTitleProps: HeaderTitleStories.HeaderTitleOrganizationStoryProps,
}

export const HeaderLoggedInStoryProps: MainHeaderProps = {
  ...MainHeaderStoryProps,
  rightItems: [...getRightItemsHeader(true)],
  headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
}

const HeaderStory: ComponentStory<typeof MainHeader> = args => <MainHeader {...args} />

export const LoggedOut = HeaderStory.bind({})
LoggedOut.args = HeaderLoggedOutStoryProps

export const OrganizationLoggedOut = HeaderStory.bind({})
OrganizationLoggedOut.args = HeaderLoggedOutOrganizationStoryProps

export const LoggedIn = HeaderStory.bind({})
LoggedIn.args = HeaderLoggedInStoryProps

export default meta

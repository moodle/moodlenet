import type { AddonItem } from '@moodlenet/component-library'
import { href } from '@moodlenet/react-app/common'
import { linkTo } from '@storybook/addon-links'
import { AvatarMenu } from './AvatarMenu.js'

const avatarPicture =
  'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200'

export const AvatarMenuHeaderItem: AddonItem = {
  Item: () => (
    <AvatarMenu
      avatarUrl={avatarPicture}
      menuItems={[]}
      profileMenuProps={{
        profileHref: href('Pages/Profile/Logged In'),
      }}
      bookmarksMenuProps={{
        bookmarksHref: href('Pages/Bookmarks/Logged In'),
      }}
      followingMenuProps={{
        followingHref: href('Pages/Following/Logged In'),
      }}
      logoutMenuProps={{
        logout: linkTo('Pages/Landing', 'Logged Out'),
      }}
      userSettingsMenuProps={{
        settingsHref: href('Pages/Settings/Default'),
      }}
      adminSettingsMenuProps={null}
    />
  ),
  key: 'avatar-menu',
}

import type { AddonItem } from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'
import { AlertButton } from '@moodlenet/ed-resource/ui'
import { href } from '@moodlenet/react-app/common'
import { HeaderTitleStories } from '@moodlenet/react-app/stories'
import type { MainHeaderProps } from '@moodlenet/react-app/ui'
import { AccessButtonsStories, AvatarMenuStories } from '@moodlenet/web-user/stories'
import { AddMenu } from '@moodlenet/web-user/ui'
import { linkTo } from '@storybook/addon-links'
import type { PartialDeep } from 'type-fest'

export const getMainHeaderStoryProps = (props?: {
  overrides?: PartialDeep<MainHeaderProps>
  isAuthenticated?: boolean
  hasAlerts?: boolean
}): MainHeaderProps => {
  const { overrides, isAuthenticated, hasAlerts } = props ?? {}

  const AddMenuItem: AddonItem = {
    Item: () => (
      <AddMenu
        menuItems={[]}
        createCollectionProps={{ createCollection: linkTo('Pages/Collection/New') }}
        createResourceProps={{ createResource: linkTo('Pages/Resource/New') }}
      />
    ),
    key: 'add-menu',
  }

  const AlertButtonItem: AddonItem | null = hasAlerts
    ? {
        Item: () => (
          <AlertButton numResourcesToReview={4} profileHref={href('Pages/Profile/Owner')} />
        ),
        key: 'alert-button',
      }
    : null

  const getRightItemsHeader = (): AddonItem[] => {
    const updatedRightItems = isAuthenticated
      ? [AlertButtonItem, AddMenuItem, AvatarMenuStories.AvatarMenuHeaderItem]
      : [
          ...AccessButtonsStories.getAccessButtons({
            loginHref: href('Pages/Access/Login/Default'),
            signupHref: href('Pages/Access/Signup/Default'),
          }),
        ]
    return updatedRightItems.filter((item): item is AddonItem => !!item)
  }

  return overrideDeep<MainHeaderProps>(
    {
      headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
      leftItems: [],
      centerItems: [],
      rightItems: [...getRightItemsHeader()],
    },
    {
      ...overrides,
    },
  )
}

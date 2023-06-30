import type { PeopleFactory } from '@moodlenet/component-library'
import { getRandomSortedArrayElements, peopleFactory } from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'
import { href } from '@moodlenet/react-app/common'
import { OverallCardStories } from '@moodlenet/react-app/stories'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import { transformPropsToObjectWithKey } from '@moodlenet/react-app/ui'
import type { ProfileCardProps } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import type { PartialDeep } from 'type-fest'

export const getProfileCardFactory = (
  profileFactory?: PeopleFactory,
  overrides?: PartialDeep<ProfileCardProps>,
): ProfileCardProps => {
  const profile = profileFactory ?? peopleFactory[Math.floor(Math.random() * peopleFactory.length)]
  return overrideDeep<ProfileCardProps>(
    {
      mainColumnItems: [],
      bottomTouchColumnItems: [],
      overallCardProps: OverallCardStories.OverallCardNoCardStoryProps,
      data: {
        userId: 'saddsadsa-21321312',
        backgroundUrl: profile?.backgroundUrl,
        avatarUrl: profile?.avatarUrl,
        profileHref: href('Pages/Profile/Logged In'),
        displayName: profile?.displayName ?? '',
      },
      state: {
        profileUrl: 'https://moodle.net/profile',
        followed: false,
        numFollowers: 13,
        isApproved: true,
      },
      actions: {
        editProfile: action('edit profile'),
        sendMessage: action('send message'),
        toggleFollow: action('toogleFollow'),
        setAvatar: action('set avatar image'),
        setBackground: action('set background image'),
      },
      access: {
        isAdmin: false,
        canEdit: false,
        isCreator: false,
        isAuthenticated: true,
        canFollow: true,
      },
    },
    { ...overrides },
  )
}

export const getProfileCardsStoryProps = (
  amount = 8,
  overrides?: PartialDeep<ProfileCardProps>,
): { props: ProxyProps<ProfileCardProps>; key: string }[] => {
  return getRandomSortedArrayElements(
    peopleFactory.map(profile => getProfileCardFactory(profile)),
    amount,
  ).map(profile => {
    const newProfile = overrideDeep<ProfileCardProps>(profile, { ...overrides })
    return transformPropsToObjectWithKey(newProfile, profile.data?.userId ?? '')
  })
}

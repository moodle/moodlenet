import {
  getRandomSortedArrayElements,
  peopleFactory,
  PeopleFactory,
} from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'
import { action } from '@storybook/addon-actions'
import { PartialDeep } from 'type-fest'
import { href } from '../../elements/link.js'
import { OverallCardNoCardStoryProps } from '../../molecules/OverallCard/OverallCard.stories.js'
import { SmallProfileCardProps } from './SmallProfileCard.js'

export const getSmallProfileCardFactory = (
  profileFactory?: PeopleFactory,
  overrides?: PartialDeep<SmallProfileCardProps>,
): SmallProfileCardProps => {
  const profile = profileFactory ?? peopleFactory[Math.floor(Math.random() * peopleFactory.length)]
  return overrideDeep<SmallProfileCardProps>(
    {
      mainColumnItems: [],
      overallCardProps: OverallCardNoCardStoryProps,
      data: {
        userId: 'saddsadsa-21321312',
        backgroundUrl: profile?.backgroundUrl ?? null,
        avatarUrl: profile?.avatarUrl ?? null,
        profileHref: href('Pages/Profile/Logged In'),
        displayName: profile?.displayName ?? '',
        organizationName: profile?.organization ?? '',
        username: profile?.username ?? '',
      },
      actions: {
        followed: false,
        toggleFollow: action('toogleFollow'),
      },
      access: {
        isCreator: false,
        isAuthenticated: false,
      },
    },
    { ...overrides },
  )
}

export const getSmallProfilesCardStoryProps = (
  amount = 8,
  overrides?: PartialDeep<SmallProfileCardProps>,
): SmallProfileCardProps[] => {
  return getRandomSortedArrayElements(
    peopleFactory.map(profile => getSmallProfileCardFactory(profile)),
    amount,
  ).map(profile => {
    return overrideDeep<SmallProfileCardProps>(profile, { ...overrides })
  })
}

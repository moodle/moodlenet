import {
  getRandomSortedArrayElements,
  peopleFactory,
  PeopleFactory,
} from '@moodlenet/component-library'
import { action } from '@storybook/addon-actions'
import { href } from '../../elements/link.js'
import { OverallCardNoCardStoryProps } from '../../molecules/OverallCard/OverallCard.stories.js'
import { SmallProfileCardProps } from './SmallProfileCard.js'

export const getSmallProfileCardFactory = (
  profileFactory?: PeopleFactory,
): SmallProfileCardProps => {
  const profile = profileFactory ?? peopleFactory[Math.floor(Math.random() * peopleFactory.length)]
  return {
    id: 'saddsadsa-21321312',
    backgroundUrl: profile?.backgroundUrl ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    profileHref: href('Pages/Profile/Logged In'),
    isOwner: false,
    isAuthenticated: false,
    followed: false,
    toggleFollow: action('toogleFollow'),
    displayName: profile?.displayName ?? '',
    organizationName: profile?.organization ?? '',
    username: profile?.username ?? '',
    overallCardProps: OverallCardNoCardStoryProps,
  }
}

export const getSmallProfilesCardStoryProps = (
  amount = 8,
  overrides?: Partial<SmallProfileCardProps>,
): SmallProfileCardProps[] => {
  return getRandomSortedArrayElements(
    peopleFactory.map(profile => getSmallProfileCardFactory(profile)),
    amount,
  ).map(profile => {
    return {
      ...profile,
      ...overrides,
    }
  })
}

import level1Avatar from '../../webapp/ui/assets/img/userLevelAvatar/level-1.png'
import level10Avatar from '../../webapp/ui/assets/img/userLevelAvatar/level-10.png'
import level2Avatar from '../../webapp/ui/assets/img/userLevelAvatar/level-2.png'
import level3Avatar from '../../webapp/ui/assets/img/userLevelAvatar/level-3.png'
import level4Avatar from '../../webapp/ui/assets/img/userLevelAvatar/level-4.png'
import level5Avatar from '../../webapp/ui/assets/img/userLevelAvatar/level-5.png'
import level6Avatar from '../../webapp/ui/assets/img/userLevelAvatar/level-6.png'
import level7Avatar from '../../webapp/ui/assets/img/userLevelAvatar/level-7.png'
import level8Avatar from '../../webapp/ui/assets/img/userLevelAvatar/level-8.png'
import level9Avatar from '../../webapp/ui/assets/img/userLevelAvatar/level-9.png'

export type UserLevelDetails = {
  minPoints: number
  maxPoints: number
  avatar: string
  title: string
  level: number
}

export const userLevels: UserLevelDetails[] = [
  { minPoints: 0, maxPoints: 14, title: 'Ambitious seed', level: 1, avatar: level1Avatar },
  { minPoints: 15, maxPoints: 74, title: 'Determined sprout', level: 2, avatar: level2Avatar },
  { minPoints: 75, maxPoints: 249, title: 'Rooted learner', level: 3, avatar: level3Avatar },
  { minPoints: 250, maxPoints: 499, title: 'Seedling scholar', level: 4, avatar: level4Avatar },
  { minPoints: 500, maxPoints: 1499, title: 'Steadily grower', level: 5, avatar: level5Avatar },
  { minPoints: 1500, maxPoints: 4999, title: 'Photosynthesist', level: 6, avatar: level6Avatar },
  { minPoints: 5000, maxPoints: 14999, title: 'Sky reacher', level: 7, avatar: level7Avatar },
  { minPoints: 15000, maxPoints: 49999, title: 'Firmly grounded', level: 8, avatar: level8Avatar },
  { minPoints: 50000, maxPoints: 99999, title: 'Versatile canopy', level: 9, avatar: level9Avatar },
  {
    minPoints: 100000,
    maxPoints: 1000000,
    title: 'Dazzling biome',
    level: 10,
    avatar: level10Avatar,
  },
]

export const actionsAndPointsObtained: { action: string; points: number; abbr?: string }[] = [
  { action: 'Create account', points: 5, abbr: 'Congrats! You already did it!' },
  {
    action: 'Complete profile',
    points: 5,
    abbr: 'Get a point for each detail filled, profile and background images, location, website, description',
  },
  {
    action: 'Set up interests',
    points: 5,
    abbr: 'Get a point when setting each the interests type in your settings page',
  },
  { action: 'Create collection', points: 5 },
  { action: 'Create resource', points: 5 },
  { action: 'New follower', points: 10 },
  { action: 'New collection follower', points: 10 },
  { action: 'New like in resource', points: 10 },
  { action: 'Account approved', points: 25 },
]

export const getUserLevelDetails = (points: number): UserLevelDetails => {
  for (const level of userLevels) {
    if (points >= level.minPoints && points <= level.maxPoints) {
      return level
    }
  }

  return (
    userLevels[userLevels.length - 1] ?? {
      minPoints: 0,
      maxPoints: 14,
      title: 'Ambitious seed',
      level: 1,
      avatar: level1Avatar,
    }
  )
}

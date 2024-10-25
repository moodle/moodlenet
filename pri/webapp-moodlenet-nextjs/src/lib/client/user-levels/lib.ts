import { pointSystem } from 'domain/src/modules/moodlenet/types/point-system'
import level1Avatar from './avatar/level-1.png'
import level10Avatar from './avatar/level-10.png'
import level2Avatar from './avatar/level-2.png'
import level3Avatar from './avatar/level-3.png'
import level4Avatar from './avatar/level-4.png'
import level5Avatar from './avatar/level-5.png'
import level6Avatar from './avatar/level-6.png'
import level7Avatar from './avatar/level-7.png'
import level8Avatar from './avatar/level-8.png'
import level9Avatar from './avatar/level-9.png'

export const userLevelAvatarSrcs = [
  level1Avatar.src,
  level2Avatar.src,
  level3Avatar.src,
  level4Avatar.src,
  level5Avatar.src,
  level6Avatar.src,
  level7Avatar.src,
  level8Avatar.src,
  level9Avatar.src,
  level10Avatar.src,
] as const

export function actionsAndPointsObtained(pointSystem: pointSystem): { action: string; points: number; abbr?: string }[] {
  return [
    {
      action: 'Create account',
      points: pointSystem.engagement.profile.welcome.points,
      abbr: 'Congrats! You already did it!',
    },
    {
      action: 'Complete profile',
      points: 5 * pointSystem.engagement.profile.perMetaDataField.points,
      abbr: 'Get a point for each detail filled, profile and background images, location, website, description',
    },
    {
      action: 'Set up interests',
      points: pointSystem.engagement.profile.interestsSet.points,
      abbr: 'Get a point when setting the interests type in your settings page',
    },
    { action: 'Publish collection', points: pointSystem.contribution.collection.published.toCreator.points },
    {
      action: "Add someone else's resource in your published collection",
      points: pointSystem.contribution.collection.listCuration.toCollectionCreator.points,
    },
    {
      action: 'Your resource added in a collection',
      points: pointSystem.contribution.collection.listCuration.toResourceCreator.points,
    },
    { action: 'Publish resource', points: pointSystem.contribution.resource.published.toCreator.points },
    {
      action: 'Follow a user, collection or subject',
      points: pointSystem.engagement.follow.followerProfile.points,
    },
    { action: 'New follower', points: pointSystem.engagement.follow.followingProfile.points },
    {
      action: 'New follower on your collection',
      points: pointSystem.engagement.follow.entityCreatorProfile.points,
    },
    { action: 'New like on your resource', points: pointSystem.curation.like.toTargetEntityCreator.points },
    { action: 'Like a resource', points: pointSystem.curation.like.toActor.points },
    {
      action: 'New bookmark on your profile or contribution',
      points: pointSystem.curation.bookmark.toTargetEntityCreator.points,
    },
    { action: 'Bookmark a contribution or user', points: pointSystem.curation.bookmark.toActor.points },
    { action: 'Become a publisher', points: pointSystem.engagement.profile.publisher.points },
  ]
}

export function getLevelDetails(pointSystem: pointSystem): UserLevelDetails[] {
  return pointSystem.pointBadgeSteps.map<UserLevelDetails>((step, index, arr) => {
    return {
      minPoints: index === 0 ? 0 : (arr[index - 1]!.lessThanPoints ?? Infinity),
      maxPoints: step.lessThanPoints ?? Infinity,
      pointAvatar: userLevelAvatarSrcs[index]!,
      title: step.title,
      level: index + 1,
    }
  })
}

export function getUserLevelDetails(pointSystem: pointSystem, points: number): UserLevelDetails {
  const levelDetails = getLevelDetails(pointSystem)
  return levelDetails.reduceRight((acc, step) => {
    if (points > step.maxPoints) {
      return acc
    }
    return step
  })
}

export type UserLevelDetails = {
  minPoints: number
  maxPoints: number
  pointAvatar: string
  title: string
  level: number
}

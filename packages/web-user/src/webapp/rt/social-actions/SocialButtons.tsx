import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { PkgAddOns } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { BookmarkButtonContainer } from './BookmarkButtonContainer.js'
import { LikeButtonContainer } from './LikeButtonContainer.js'
import { SmallFollowButtonContainer } from './SmallFollowButtonContainer.js'

export type EntityAndKey = {
  _key: string
  entityType: KnownEntityType
}

export type EntityKey = FC<EntityAndKey>

// @ALE move where ??
const objectMap = <T, V>(obj: T, fn: (val: T[keyof T], key: keyof T) => V) =>
  Object.entries(obj as Record<keyof T, V>).reduce(
    (acc, [key, val]) => ((acc[key as keyof T] = fn(val as T[keyof T], key as keyof T)), acc),
    {} as Record<keyof T, V>,
  )

const mapToItemEntity = (props: EntityAndKey) => (Fc: FC<EntityAndKey>) => ({
  Item: () => <Fc {...props} />,
})

const socialButtonsContainer = {
  followButton: SmallFollowButtonContainer,
  bookMarkButton: BookmarkButtonContainer,
  likeButton: LikeButtonContainer,
}

export const socialButtonsAddonsProps = (props: EntityAndKey) =>
  objectMap(socialButtonsContainer, mapToItemEntity(props))

type SocialButtonsAddons = {
  likeAndBookmark: PkgAddOns<AddonItemNoKey>
  followAndBookMark: PkgAddOns<AddonItemNoKey>
}

export const useSocialButtonsAddons = (_key: string, entityType: KnownEntityType) => {
  return useMemo<SocialButtonsAddons>(() => {
    const props = { _key, entityType }
    const { likeButton, bookMarkButton, followButton } = socialButtonsAddonsProps(props)
    return {
      likeAndBookmark: { likeButton, bookMarkButton },
      followAndBookMark: { followButton, bookMarkButton },
    }
  }, [_key, entityType])
}

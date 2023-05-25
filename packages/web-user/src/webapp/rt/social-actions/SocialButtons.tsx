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

const entityKeyToItemNoKey =
  (props: EntityAndKey) =>
  (Fc: EntityKey): AddonItemNoKey => ({ Item: () => <Fc {...props} /> })

export const useSocialButtons = (_key: string, entityType: KnownEntityType) => {
  return useMemo(() => {
    const toItemEntity = entityKeyToItemNoKey({ _key, entityType })
    return {
      followButton: toItemEntity(SmallFollowButtonContainer),
      bookMarkButton: toItemEntity(BookmarkButtonContainer),
      likeButton: toItemEntity(LikeButtonContainer),
    }
  }, [_key, entityType])
}

export const useLikeAndBookMarkButtons = (key: string, entityType: KnownEntityType) => {
  const { likeButton, bookMarkButton } = useSocialButtons(key, entityType)
  return useMemo<PkgAddOns<AddonItemNoKey>>(
    () => ({ likeButton, bookMarkButton }),
    [likeButton, bookMarkButton],
  )
}
export const useFollowAndBookMarkButtons = (key: string, entityType: KnownEntityType) => {
  const { followButton, bookMarkButton } = useSocialButtons(key, entityType)
  return useMemo<PkgAddOns<AddonItemNoKey>>(
    () => ({ followButton, bookMarkButton }),
    [bookMarkButton, followButton],
  )
}

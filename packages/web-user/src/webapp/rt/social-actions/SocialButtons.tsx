import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { PkgAddOns } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { BookmarkButtonContainer } from './BookmarkButtonContainer.js'
import { LikeButtonContainer } from './LikeButtonContainer.js'
import { SmallFollowButtonContainer } from './SmallFollowButtonContainer.js'

export type EntityKey = FC<{
  _key: string
  entityType: KnownEntityType
}>

export const useSocialButtons = (key: string, entityType: KnownEntityType) => {
  const withProps = (Fc: EntityKey) => ({ Item: () => <Fc _key={key} entityType={entityType} /> })
  return {
    followButton: withProps(SmallFollowButtonContainer),
    bookMarkButton: withProps(BookmarkButtonContainer),
    likeButton: withProps(LikeButtonContainer),
  }
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

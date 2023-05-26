import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { PkgAddOns } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { BookmarkButtonContainer } from './BookmarkButtonContainer.js'
import { LikeButtonContainer } from './LikeButtonContainer.js'
import { SmallFollowButtonContainer } from './SmallFollowButtonContainer.js'

// @ALE move where ??
const objectMap = <T, V>(obj: T, fn: (val: T[keyof T], key: keyof T) => V) =>
  Object.entries(obj as Record<keyof T, V>).reduce(
    (acc, [key, val]) => ((acc[key as keyof T] = fn(val as T[keyof T], key as keyof T)), acc),
    {} as Record<keyof T, V>,
  )

export type EntityAndKey = { _key: string; entityType: KnownEntityType }
type ItemElementNames = Partial<keyof typeof socialItemElements>
type PkgAddonsByName = Partial<Record<ItemElementNames, PkgAddOns<AddonItemNoKey>>>
export type SocialAddonsConfig = Partial<Record<KnownEntityType, ItemElementNames[]>>
// const pakElem: PkgAddOns<AddonItemNoKey> = { aaa: { Item: () => <LikeButtonContainer _key="dd" entityType="collection" /> }

export const socialItemElements = {
  follow: SmallFollowButtonContainer,
  bookmark: BookmarkButtonContainer,
  like: LikeButtonContainer,
}

const mapSocialItemsElementToPkgAddOns = (props: EntityAndKey): PkgAddonsByName =>
  objectMap(socialItemElements, (Fc, name) => ({ [name]: { Item: () => <Fc {...props} /> } }))

type MyPkgAddOns = PkgAddOns<AddonItemNoKey> | null // alias
export const socialItemsAddons = (addonsByEnity: SocialAddonsConfig, props: EntityAndKey) => {
  const pkgAddons = mapSocialItemsElementToPkgAddOns(props)
  const mapButtonAddons = (acc: MyPkgAddOns, btName: ItemElementNames) => ({
    ...acc,
    ...pkgAddons[btName],
  })
  const itemELemStrList = addonsByEnity[props.entityType]
  return !itemELemStrList ? null : itemELemStrList.reduce(mapButtonAddons, {})
}

export function getUseSocialButtonsAddons(addonsByEnity: SocialAddonsConfig) {
  const useSocialButtonsAddons = (_key: string, entityType: KnownEntityType): MyPkgAddOns =>
    useMemo(() => socialItemsAddons(addonsByEnity, { _key, entityType }), [_key, entityType])

  return { useSocialButtonsAddons }
}

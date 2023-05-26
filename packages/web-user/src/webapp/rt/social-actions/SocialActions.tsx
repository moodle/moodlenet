import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { PkgAddOns } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { objectMap } from '../lib/helper.mjs'

export type SocialActionsName = 'follow' | 'like' | 'bookmark'
export type EntityAndKey = { _key: string; entityType: KnownEntityType }
export type SocialActions = Partial<Record<SocialActionsName, FC<EntityAndKey>>>
export type SocialActionsConfig = Partial<Record<KnownEntityType, SocialActionsName[]>>
// test if type work const pakElem: PkgAddOns<AddonItemNoKey> = { aaa: { Item: () => <LikeButtonContainer _key="dd" entityType="collection" /> }

const mapSocialActionsToPkgAddons = (sc: SocialActions, props: EntityAndKey) =>
  objectMap(sc, (Fc, name) => ({ [name]: { Item: () => (!Fc ? null : <Fc {...props} />) } }))

type MyPkgAddOns = PkgAddOns<AddonItemNoKey> | null // alias
export const socialItemsAddons = (
  socialKeyItems: SocialActions,
  addonsByEnity: SocialActionsConfig,
  props: EntityAndKey,
) => {
  const pkgAddons = mapSocialActionsToPkgAddons(socialKeyItems, props)
  const mapSocialActionDef = (acc: MyPkgAddOns, name: SocialActionsName) => ({
    ...acc,
    ...pkgAddons[name],
  })
  const itemELemStrList = addonsByEnity[props.entityType]
  return !itemELemStrList ? null : itemELemStrList.reduce(mapSocialActionDef, {})
}

export function getUseSocialActions(actions: SocialActions, config: SocialActionsConfig) {
  const useSocialActions = (_key: string, entityType: KnownEntityType): MyPkgAddOns =>
    useMemo(() => socialItemsAddons(actions, config, { _key, entityType }), [_key, entityType])

  return { useSocialActions }
}

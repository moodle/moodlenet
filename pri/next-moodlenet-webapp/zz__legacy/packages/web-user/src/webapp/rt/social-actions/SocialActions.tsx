import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { useMemo, type FC } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { objectMap } from '../lib/helper.mjs'

export type SocialActionsName = 'follow' | 'like' | 'bookmark'
export type EntityAndKeyAndIsCreator = {
  _key: string
  entityType: KnownEntityType
  info: null | undefined | { name: string; isCreator: boolean }
}
export type SocialActions = Partial<Record<SocialActionsName, FC<EntityAndKeyAndIsCreator>>>
export type SocialActionsConfig = Partial<Record<KnownEntityType, SocialActionsName[]>>
export type PkgAddOnsByName = Record<SocialActionsName, AddOnMap<AddonItemNoKey>>
// test if type work const pakElem: PkgAddOns<AddonItemNoKey> = { aaa: { Item: () => <LikeButtonContainer _key="dd" entityType="collection" /> }

const mapSocialActionsToPkgAddons = (sc: SocialActions, props: EntityAndKeyAndIsCreator) =>
  objectMap(sc, (Fc, name) => ({
    [name]: {
      Item: () =>
        !Fc ? null : <Fc {...props} key={`${props.entityType}#${props._key}::${name}`} />,
    },
  }))

const mapSocialActionElements =
  (pkgAddons: PkgAddOnsByName) => (acc: MyPkgAddOns, name: SocialActionsName) => ({
    ...acc,
    ...pkgAddons[name],
  })

type MyPkgAddOns = AddOnMap<AddonItemNoKey> | undefined // alias
export const socialItemsAddons = (
  socialActions: SocialActions,
  addonsByEnity: SocialActionsConfig,
  props: EntityAndKeyAndIsCreator,
) => {
  const pkgAddons = mapSocialActionsToPkgAddons(socialActions, props)
  const itemELemStrList = addonsByEnity[props.entityType]
  return !itemELemStrList
    ? undefined
    : itemELemStrList.reduce(mapSocialActionElements(pkgAddons), {})
}

export function getUseComposeSocialActions(actions: SocialActions, config: SocialActionsConfig) {
  const useComposeSocialActions = (
    _key: string,
    entityType: KnownEntityType,
    info: null | undefined | { name: string; isCreator: boolean },
  ): MyPkgAddOns =>
    useMemo(
      () => socialItemsAddons(actions, config, { _key, entityType, info }),
      [_key, entityType, info],
    )

  return { useComposeSocialActions }
}

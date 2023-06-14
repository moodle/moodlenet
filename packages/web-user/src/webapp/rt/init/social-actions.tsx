import { CollectionCardPlugins, CollectionPagePlugins } from '@moodlenet/collection/webapp'
import { ResourceCardPlugins, ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import { BookmarkButtonContainer, LikeButtonContainer } from '../exports.mjs'
import { useSwichAddonsByAuth } from '../lib/AddonsByUserRule.js'
import { resourcePageAddonsByAuth } from '../menus/menuAddons.js'
import { SmallFollowButtonContainer } from '../social-actions/SmallFollowButtonContainer.js'
import type { SocialActions, SocialActionsConfig } from '../social-actions/SocialActions.js'
import { getUseSocialActions } from '../social-actions/SocialActions.js'

const socialActions: SocialActions = {
  follow: SmallFollowButtonContainer,
  bookmark: BookmarkButtonContainer,
  like: LikeButtonContainer,
}
const addonsByEnity: SocialActionsConfig = {
  resource: ['bookmark', 'like'],
  collection: ['bookmark', 'follow'],
}
const { useSocialActions } = getUseSocialActions(socialActions, addonsByEnity)
ResourcePagePlugins.register(({ useGeneralAction, useTopRightHeaderItems, resourceKey }) => {
  useGeneralAction(useSwichAddonsByAuth(resourcePageAddonsByAuth))
  useTopRightHeaderItems(useSocialActions(resourceKey, 'resource'))
})
ResourceCardPlugins.register(({ useBottomRightItems, resourceKey }) => {
  useBottomRightItems(useSocialActions(resourceKey, 'resource'))
})
CollectionCardPlugins.register(({ collectionKey, useTopRightItems }) => {
  useTopRightItems(useSocialActions(collectionKey, 'collection'))
})
CollectionPagePlugins.register(({ useTopRightHeaderItems, collectionKey }) => {
  useTopRightHeaderItems(useSocialActions(collectionKey, 'collection'))
})

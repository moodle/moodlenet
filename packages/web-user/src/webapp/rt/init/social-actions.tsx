import { CollectionCardPlugins, CollectionPagePlugins } from '@moodlenet/collection/webapp'
import { ResourceCardPlugins, ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import { BookmarkButtonContainer, LikeButtonContainer } from '../exports.mjs'
import { useSwichAddonsByAuth } from '../lib/AddonsByUserRule.js'
import { resourcePageAddonsByAuth } from '../menus/menuAddons.js'
import { SmallFollowButtonContainer } from '../social-actions/SmallFollowButtonContainer.js'
import type { SocialActions, SocialActionsConfig } from '../social-actions/SocialActions.js'
import { getUseComposeSocialActions } from '../social-actions/SocialActions.js'

const socialActions: SocialActions = {
  follow: SmallFollowButtonContainer,
  bookmark: BookmarkButtonContainer,
  like: LikeButtonContainer,
}

const addonsByEnity: SocialActionsConfig = {
  resource: ['bookmark', 'like'],
  collection: ['bookmark', 'follow'],
}

const { useComposeSocialActions: composeSocialActions } = getUseComposeSocialActions(
  socialActions,
  addonsByEnity,
)

ResourcePagePlugins.register(({ info, resourceKey }) => {
  return {
    generalAction: useSwichAddonsByAuth(resourcePageAddonsByAuth),
    topRightHeaderItems: composeSocialActions(resourceKey, 'resource', info),
  }
})

ResourceCardPlugins.register(({ resourceKey, info }) => {
  return {
    bottomRightItems: composeSocialActions(resourceKey, 'resource', info),
  }
})

CollectionCardPlugins.register(({ collectionKey, info }) => {
  return {
    topRightItems: composeSocialActions(collectionKey, 'collection', info),
  }
})
CollectionPagePlugins.register(({ collectionKey, info }) => {
  return { topRightHeaderItems: composeSocialActions(collectionKey, 'collection', info) }
})

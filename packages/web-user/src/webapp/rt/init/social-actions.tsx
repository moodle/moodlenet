import { PermIdentity } from '@material-ui/icons'
import { CollectionCardPlugins, CollectionPagePlugins } from '@moodlenet/collection/webapp'
import type { PluginHookResult } from '@moodlenet/core/lib'
import { SubjectCardPlugins, SubjectPagePlugins } from '@moodlenet/ed-meta/webapp'
import { ResourceCardPlugins, ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import { useEffect, useMemo, useState } from 'react'
import { BookmarkButtonContainer, LikeButtonContainer } from '../exports.mjs'
import { useSwichAddonsByAuth } from '../lib/AddonsByUserRule.js'
import { resourcePageAddonsByAuth } from '../menus/menuAddons.js'
import { shell } from '../shell.mjs'
import { FollowButtonContainer } from '../social-actions/FollowButtonContainer.js'
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
  subject: ['follow'],
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

function useSubjectFollowersCount(subjectKey: string) {
  const [numFollowers, setNumFollowers] = useState(0)
  useEffect(() => {
    shell.rpc.me[
      'webapp/feature-entity/count/:feature(follow|like)/:entityType(profile|collection|resource|subject)/:_key'
    ](undefined, { _key: subjectKey, entityType: 'subject', feature: 'follow' }).then(res =>
      setNumFollowers(res.count),
    )
  }, [subjectKey])
  return { numFollowers }
}
SubjectCardPlugins.register(({ subjectKey }) => {
  const { numFollowers } = useSubjectFollowersCount(subjectKey)
  return {
    overallItems: {
      numFollowers: { name: 'Followers', value: numFollowers, Icon: <PermIdentity /> },
    },
  }
})
SubjectPagePlugins.register(({ subjectKey }) => {
  const FollowBtn = useMemo(
    () =>
      function FollowBtn() {
        return (
          <FollowButtonContainer
            _key={subjectKey}
            entityType="subject"
            info={{ isCreator: false, name: subjectKey }}
          />
        )
      },
    [subjectKey],
  )
  const { numFollowers } = useSubjectFollowersCount(subjectKey)
  const hookResult: PluginHookResult<typeof SubjectPagePlugins> = {
    main_headerItems: {
      followBtn: { Item: FollowBtn },
    },
    overallItems: {
      numFollowers: { name: 'Followers', value: numFollowers },
    },
  }
  return hookResult
})

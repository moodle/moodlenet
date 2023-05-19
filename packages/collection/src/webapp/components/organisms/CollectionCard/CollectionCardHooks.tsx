// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { ItemWithoutKey } from '@moodlenet/ed-resource/webapp'
import { href } from '@moodlenet/react-app/common'
import { createHookPlugin } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { CollectionCardData } from '../../../../common/types.mjs'
import { getCollectionHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { useMainHook } from '../../../MainHooks.js'
import type { CollectionCardProps } from './CollectionCard.js'

export const CollectionCardPlugins = createHookPlugin<{
  topRightItems: ItemWithoutKey
  // topLeftItems: ItemWithoutKey,
}>({ topRightItems: null })

export const useCollectionCardProps = (collectionKey: string): CollectionCardProps | null => {
  const _mainProps = useMainHook({ collectionKey })
  const [addons] = CollectionCardPlugins.useHookPlugin()

  const collectionProps = useMemo(() => {
    if (!_mainProps) return null
    const { props, actions } = _mainProps

    const { data: dataProps, state, access, form } = props
    const { collectionId, imageUrl } = dataProps
    const data: CollectionCardData = {
      collectionId,
      imageUrl,
      title: form.title,
      collectionHref: href(getCollectionHomePageRoutePath({ _key: collectionKey })),
    }
    const propsPage: CollectionCardProps = {
      mainColumnItems: [],
      topLeftItems: [],
      topRightItems: addons.topRightItems,
      data,
      state,
      actions,
      access,
    }

    return propsPage
  }, [_mainProps, addons.topRightItems, collectionKey])

  return collectionProps
}

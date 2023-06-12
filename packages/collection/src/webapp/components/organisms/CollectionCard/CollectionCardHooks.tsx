// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import { href } from '@moodlenet/react-app/common'
import { createHookPlugin } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { CollectionCardData } from '../../../../common/types.mjs'
import { getCollectionHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { useMainHook } from '../../../MainHooks.js'
import type { CollectionCardProps } from './CollectionCard.js'

export const CollectionCardPlugins = createHookPlugin<
  {
    topLeftItems: AddonItemNoKey
    topRightItems: AddonItemNoKey
    mainColumnItems: AddonItemNoKey
  },
  {
    collectionKey: string
  }
>({ topRightItems: null, mainColumnItems: null, topLeftItems: null })

export const useCollectionCardProps = (collectionKey: string): CollectionCardProps | null => {
  const _mainProps = useMainHook({ collectionKey })
  const [addons] = CollectionCardPlugins.useHookPlugin({ collectionKey })

  const collectionProps = useMemo(() => {
    if (!_mainProps) return null
    const { props, actions } = _mainProps

    const { data: dataProps, state, access, form } = props
    const { id, imageUrl } = dataProps
    const data: CollectionCardData = {
      id,
      imageUrl,
      title: form.title,
      collectionHref: href(
        getCollectionHomePageRoutePath({ _key: collectionKey, title: form.title }),
      ),
    }
    const propsPage: CollectionCardProps = {
      mainColumnItems: addons.mainColumnItems,
      topLeftItems: addons.topLeftItems,
      topRightItems: addons.topRightItems,
      data,
      state,
      actions,
      access,
    }

    return propsPage
  }, [_mainProps, addons.mainColumnItems, addons.topLeftItems, addons.topRightItems, collectionKey])

  return collectionProps
}

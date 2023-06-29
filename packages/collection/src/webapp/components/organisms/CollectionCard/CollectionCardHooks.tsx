// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { href } from '@moodlenet/react-app/common'
import { createPlugin } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { CollectionCardData } from '../../../../common/types.mjs'
import { getCollectionHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { useMainHook } from '../../../MainHooks.js'
import type { CollectionCardProps } from './CollectionCard.js'

export const CollectionCardPlugins = createPlugin<
  {
    topLeftItems?: AddOnMap<AddonItemNoKey>
    topRightItems?: AddOnMap<AddonItemNoKey>
    mainColumnItems?: AddOnMap<AddonItemNoKey>
  },
  {
    collectionKey: string
    info: null | undefined | { name: string; isCreator: boolean }
  }
>()

export const useCollectionCardProps = (collectionKey: string): CollectionCardProps | null => {
  const collectionMainProps = useMainHook({ collectionKey })

  const info = useMemo(
    () =>
      collectionMainProps && {
        name: collectionMainProps.props.form.title,
        isCreator: collectionMainProps.props.access.isCreator,
      },
    [collectionMainProps],
  )
  const plugins = CollectionCardPlugins.usePluginHooks({
    collectionKey,
    info,
  })

  if (!collectionMainProps) return null
  const { props, actions } = collectionMainProps

  const { data: dataProps, state, access, form } = props
  const { id, image } = dataProps
  const data: CollectionCardData = {
    id,
    image,
    title: form.title,
    collectionHref: href(
      getCollectionHomePageRoutePath({ _key: collectionKey, title: form.title }),
    ),
  }
  const collectionProps: CollectionCardProps = {
    mainColumnItems: plugins.getKeyedAddons('mainColumnItems'),
    topLeftItems: plugins.getKeyedAddons('topLeftItems'),
    topRightItems: plugins.getKeyedAddons('topRightItems'),
    data,
    state,
    actions,
    access,
  }

  return collectionProps
}

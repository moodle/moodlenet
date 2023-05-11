// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { href } from '@moodlenet/react-app/common'
import { useMemo } from 'react'
import type { CollectionCardData } from '../../../../common/types.mjs'
import { useMainHook } from '../../../MainHooks.js'
import type { CollectionCardProps } from './CollectionCard.js'

export const useCollectionCardProps = (collectionKey: string): CollectionCardProps | null => {
  const _mainProps = useMainHook({ collectionKey })

  const collectionProps = useMemo(() => {
    if (!_mainProps) return null
    const { props, actions } = _mainProps
    const { data: dataProps, state, access, form } = props
    const { collectionId, imageUrl } = dataProps
    const data: CollectionCardData = {
      collectionId,
      imageUrl,
      title: form.title,
      collectionHref: href('Pages/Collection/Logged In'),
    }
    const propsPage: CollectionCardProps = {
      mainColumnItems: [],
      topLeftItems: [],
      topRightItems: [],
      data,
      state,
      actions,
      access,
    }

    return propsPage
  }, [_mainProps])

  return collectionProps
}

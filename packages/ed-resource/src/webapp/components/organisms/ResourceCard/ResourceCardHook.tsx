// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import { href } from '@moodlenet/react-app/common'
import { createHookPlugin } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { ResourceCardDataProps } from '../../../../common/types.mjs'
import { getResourceHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
import type { ResourceCardPropsData } from './ResourceCard.js'

export const ResourceCardPlugins = createHookPlugin<
  {
    mainColumnItems: AddonItemNoKey
    topLeftItems: AddonItemNoKey
    bottomLeftItems: AddonItemNoKey
    bottomRightItems: AddonItemNoKey
    topRightItems: AddonItemNoKey
  },
  { resourceKey: string }
>({
  topRightItems: null,
  bottomLeftItems: null,
  bottomRightItems: null,
  mainColumnItems: null,
  topLeftItems: null,
})

export const useResourceCardProps = (resourceKey: string): ResourceCardPropsData | null => {
  const _mainProps = useResourceBaseProps({ resourceKey })

  const [addons] = ResourceCardPlugins.useHookPlugin({ resourceKey })

  const dataProps = useMemo(() => {
    if (!_mainProps) return null
    const { props, actions } = _mainProps
    const {
      data: dataProps,
      state,
      access,
      resourceForm: { title },
      contributor,
    } = props

    const { displayName, creatorProfileHref: profileHref, avatarUrl: avatar } = contributor
    const owner = { displayName, avatar, profileHref }
    const { id, imageUrl, contentType, contentUrl, downloadFilename } = dataProps
    const data: ResourceCardDataProps = {
      id,
      imageUrl,
      title,
      contentType,
      contentUrl,
      downloadFilename,
      owner,
      resourceHomeHref: href(getResourceHomePageRoutePath({ _key: resourceKey, title })),
    }
    return { data, state, access, actions }
  }, [_mainProps, resourceKey])

  const collectionProps = useMemo(() => {
    if (!dataProps) return null
    const { data, state, access, actions } = dataProps
    const propsPage: ResourceCardPropsData = {
      mainColumnItems: addons.mainColumnItems,
      topLeftItems: addons.topLeftItems,
      topRightItems: addons.topRightItems,
      bottomLeftItems: addons.bottomLeftItems,
      bottomRightItems: addons.bottomRightItems,
      data,
      state,
      actions,
      access,
    }

    return propsPage
  }, [
    addons.bottomLeftItems,
    addons.bottomRightItems,
    addons.mainColumnItems,
    addons.topLeftItems,
    addons.topRightItems,
    dataProps,
  ])

  return collectionProps
}

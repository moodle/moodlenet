// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { href } from '@moodlenet/react-app/common'
import { createPlugin } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { ResourceCardDataProps } from '../../../../common/types.mjs'
import { getResourceHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
import type { ResourceCardPropsData } from './ResourceCard.js'

export const ResourceCardPlugins = createPlugin<
  {
    mainColumnItems?: AddOnMap<AddonItemNoKey>
    topLeftItems?: AddOnMap<AddonItemNoKey>
    bottomLeftItems?: AddOnMap<AddonItemNoKey>
    bottomRightItems?: AddOnMap<AddonItemNoKey>
    topRightItems?: AddOnMap<AddonItemNoKey>
  },
  { resourceKey: string; info: undefined | null | { name: string; isCreator: boolean } }
>()

export const useResourceCardProps = (resourceKey: string): ResourceCardPropsData | null => {
  const resourceCommonProps = useResourceBaseProps({ resourceKey })

  const info = useMemo(
    () =>
      resourceCommonProps && {
        name: resourceCommonProps.props.resourceForm.title,
        isCreator: resourceCommonProps.props.access.isCreator,
      },
    [resourceCommonProps],
  )
  const plugins = ResourceCardPlugins.usePluginHooks({
    resourceKey,
    info,
  })

  const dataProps = useMemo(() => {
    if (!resourceCommonProps) return null
    const { props, actions } = resourceCommonProps
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
  }, [resourceCommonProps, resourceKey])

  if (!dataProps) return null
  const { data, state, access, actions } = dataProps
  const collectionProps: ResourceCardPropsData = {
    mainColumnItems: plugins.getKeyedAddons('mainColumnItems'),
    topLeftItems: plugins.getKeyedAddons('topLeftItems'),
    topRightItems: plugins.getKeyedAddons('topRightItems'),
    bottomLeftItems: plugins.getKeyedAddons('bottomLeftItems'),
    bottomRightItems: plugins.getKeyedAddons('bottomRightItems'),
    data,
    state,
    actions,
    access,
  }

  return collectionProps
}

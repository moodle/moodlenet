// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { href } from '@moodlenet/react-app/common'
import { useMemo } from 'react'
import type { ResourceCardDataProps } from '../../../../common/types.mjs'
import { getResourceHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
import type { ResourceCardPropsData } from './ResourceCard.js'

export const useResourceCardProps = (resourceKey: string): ResourceCardPropsData | null => {
  const _mainProps = useResourceBaseProps({ resourceKey })

  const collectionProps = useMemo(() => {
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
    const { resourceId, imageUrl, contentType, contentUrl, downloadFilename } = dataProps
    const data: ResourceCardDataProps = {
      resourceId,
      imageUrl,
      title,
      contentType,
      contentUrl,
      downloadFilename,
      owner,
      resourceHomeHref: href(getResourceHomePageRoutePath({ _key: resourceKey })),
    }

    const propsPage: ResourceCardPropsData = {
      mainColumnItems: [],
      topLeftItems: [],
      topRightItems: [],
      bottomLeftItems: [],
      bottomRightItems: [],
      data,
      state,
      actions,
      access,
    }

    return propsPage
  }, [_mainProps, resourceKey])

  return collectionProps
}

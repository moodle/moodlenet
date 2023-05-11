// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
import type { ResourceCardDataProps } from '../../../../common/types.mjs'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
import type { ResourceCardProps } from './ResourceCard.js'

export const useResourceCardProps = (resourceKey: string): ResourceCardProps | null => {
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
      resourceHomeHref: undefined,
      // collectionHref: href('Pages/Collection/Logged In'),
    }

    const propsPage: ResourceCardProps = {
      mainColumnItems: [],
      topLeftItems: [],
      topRightItems: [],
      bottomLeftItems: [],
      bottomRightItems: [],
      className: '',
      orientation: 'vertical',
      showDeleteButton: true,
      data,
      state,
      actions,
      access,
      //   onClick?(arg0: unknown): unknown
      // onRemoveClick?(arg0: unknown): unknown
    }

    return propsPage
  }, [_mainProps])

  return collectionProps
}

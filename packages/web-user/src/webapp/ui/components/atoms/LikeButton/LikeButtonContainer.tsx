import type { FC } from 'react'
import type { KnownEntityTypes } from '../../../../../common/types.mjs'
import { LikeButton } from './LikeButton.js'
import { useLikeButtonProps } from './LikeButtonHook.js'

export const LikeButtonContainer: FC<{
  _key: string
  entityType: KnownEntityTypes
}> = props => {
  const { _key, entityType } = props
  const panelProps = useLikeButtonProps({ _key, entityType })
  if (!panelProps) {
    return null
  }
  return <LikeButton {...panelProps} />
}

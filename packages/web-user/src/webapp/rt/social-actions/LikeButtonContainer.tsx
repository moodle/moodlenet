import type { FC } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { LikeButton } from '../../ui/exports/ui.mjs'
import { useLikeButtonProps } from './LikeButtonHook.js'

export const LikeButtonContainer: FC<{
  _key: string
  entityType: KnownEntityType
  info: null | undefined | { name: string; isCreator: boolean }
}> = props => {
  const { _key, entityType, info } = props
  const panelProps = useLikeButtonProps({ _key, entityType, info })
  if (!panelProps) {
    return null
  }
  return <LikeButton {...panelProps} />
}

import type { FC } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { SmallFollowButton } from '../../ui/exports/ui.mjs'
import { useSmallFollowButtonProps } from './SmallFollowButtonHook.js'

export const SmallFollowButtonContainer: FC<{
  _key: string
  entityType: KnownEntityType
  info: null | undefined | { name: string; isCreator: boolean }
}> = ({ _key, entityType, info }) => {
  const smallFollowButtonProps = useSmallFollowButtonProps({ _key, entityType, info })
  if (!smallFollowButtonProps) {
    return null
  }
  return <SmallFollowButton {...smallFollowButtonProps} key={`${entityType}#${_key}`} />
}

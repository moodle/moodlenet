import type { FC } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { FollowButton } from '../../ui/exports/ui.mjs'
import { useFollowButtonProps } from './FollowButtonHook'

export const FollowButtonContainer: FC<{
  _key: string
  entityType: KnownEntityType
  info: null | { name: string; isCreator: boolean }
}> = ({ _key, entityType, info }) => {
  const FollowButtonProps = useFollowButtonProps({ _key, entityType, info })
  if (!FollowButtonProps) {
    return null
  }
  return <FollowButton {...FollowButtonProps} />
}

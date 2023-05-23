import type { FC } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { FollowButton } from '../../ui/exports/ui.mjs'
import { useFollowButtonProps } from './FollowButtonHook.js'

export const FollowButtonContainer: FC<{
  _key: string
  entityType: KnownEntityType
}> = ({ _key, entityType }) => {
  const FollowButtonProps = useFollowButtonProps({ _key, entityType })
  if (!FollowButtonProps) {
    return null
  }
  return <FollowButton {...FollowButtonProps} />
}

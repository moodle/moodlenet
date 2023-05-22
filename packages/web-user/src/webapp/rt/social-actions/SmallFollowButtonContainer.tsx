import type { FC } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { SmallFollowButton } from '../../ui/exports/ui.mjs'
import { useSmallFollowButtonProps } from './SmallFollowButtonHook.js'

export const SmallFollowButtonContainer: FC<{
  _key: string
  entityType: KnownEntityType
}> = ({ _key, entityType }) => {
  const smallFollowButtonProps = useSmallFollowButtonProps({ _key, entityType })
  if (!smallFollowButtonProps) {
    return null
  }
  return <SmallFollowButton {...smallFollowButtonProps} />
}

import type { FC } from 'react'
import { AvatarMenu } from '../../ui/exports/ui.mjs'
import { useAvatarMenuProps } from './AvatarMenuHook'

export const AvatarMenuContainer: FC = () => {
  const avatarMenuProps = useAvatarMenuProps()
  return <AvatarMenu {...avatarMenuProps} />
}

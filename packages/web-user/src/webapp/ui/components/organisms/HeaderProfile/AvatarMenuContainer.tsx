import { FC } from 'react'
import { AvatarMenu } from './AvatarMenu.js'
import { useAvatarMenuProps } from './AvatarMenuHook.mjs'

export const AvatarMenuContainer: FC = () => {
  const avatarMenuProps = useAvatarMenuProps()
  return <AvatarMenu {...avatarMenuProps} />
}

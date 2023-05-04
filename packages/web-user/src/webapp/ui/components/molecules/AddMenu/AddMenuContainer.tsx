import type { FC } from 'react'
import { AddMenu } from './AddMenu.js'
import { useAddMenuProps } from './AddMenuHook.js'

export const AddMenuContainer: FC = () => {
  const addMenuProps = useAddMenuProps()
  return <AddMenu {...addMenuProps} />
}

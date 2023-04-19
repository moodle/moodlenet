import { FC } from 'react'
import { AddMenu } from './AddMenu.js'
import { useAddMenuProps } from './AddMenuHook.mjs'

export const AddMenuContainer: FC = () => {
  const addMenuProps = useAddMenuProps()
  return <AddMenu {...addMenuProps} />
}

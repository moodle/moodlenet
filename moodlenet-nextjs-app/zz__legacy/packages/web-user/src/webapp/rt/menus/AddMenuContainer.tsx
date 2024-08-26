import type { FC } from 'react'
import { AddMenu } from '../../ui/components/molecules/AddMenu/AddMenu.js'
import { useAddMenuProps } from './AddMenuHook.js'

export const AddMenuContainer: FC = () => {
  const addMenuProps = useAddMenuProps()
  return <AddMenu {...addMenuProps} />
}

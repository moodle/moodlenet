import type { FC } from 'react'
import { AddMenu } from '../../ui/components/molecules/AddMenu/AddMenu'
import { useAddMenuProps } from './AddMenuHook'

export const AddMenuContainer: FC = () => {
  const addMenuProps = useAddMenuProps()
  return <AddMenu {...addMenuProps} />
}

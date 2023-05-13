import { LibraryAdd, NoteAdd } from '@material-ui/icons'
import type { FC } from 'react'

export type CreateResourceAddMenuItemProps = { createResource(): void }
export const CreateResourceAddMenuItem: FC<{ createResource(): void }> = ({ createResource }) => (
  <div onClick={createResource}>
    <NoteAdd />
    New resource
  </div>
)

export type CreateCollectionAddMenuItemProps = { createCollection(): void }
export const CreateCollectionAddMenuItem: FC<CreateCollectionAddMenuItemProps> = ({
  createCollection,
}) => (
  <div onClick={createCollection}>
    <LibraryAdd />
    New collection
  </div>
)

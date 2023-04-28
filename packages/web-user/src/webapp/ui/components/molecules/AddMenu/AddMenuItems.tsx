import { LibraryAdd, NoteAdd } from '@material-ui/icons'
import { FC } from 'react'

export const CreateResourceAddMenuItem: FC<{ createResource(): void }> = ({ createResource }) => (
  <div onClick={createResource}>
    <NoteAdd />
    New resource
  </div>
)
export const CreateCollectionAddMenuItem: FC<{ createCollection(): void }> = ({
  createCollection,
}) => (
  <div onClick={createCollection}>
    <LibraryAdd />
    New collection
  </div>
)

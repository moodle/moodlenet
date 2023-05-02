import { LibraryAdd, NoteAdd } from '@material-ui/icons'
import { proxied } from '@moodlenet/react-app/ui'

export type CreateResourceAddMenuItemProps = { createResource(): void }
export const CreateResourceAddMenuItem = proxied<{ createResource(): void }>(
  ({ createResource }) => (
    <div onClick={createResource}>
      <NoteAdd />
      New resource
    </div>
  ),
)

export type CreateCollectionAddMenuItemProps = { createCollection(): void }
export const CreateCollectionAddMenuItem = proxied<CreateCollectionAddMenuItemProps>(
  ({ createCollection }) => (
    <div onClick={createCollection}>
      <LibraryAdd />
      New collection
    </div>
  ),
)

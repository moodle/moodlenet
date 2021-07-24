import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { FC } from 'react';
import addIcon from '../../../assets/icons/add.svg';
import { Href, Link } from '../../../elements/link';
import './styles.scss';

export type AddButtonProps = {
  newResourceHref: Href
  newCollectionHref: Href
  onClick?(): unknown
}

export const AddButton: FC<AddButtonProps> = ({ onClick, newResourceHref, newCollectionHref }) => {
  return (
    <div className="add-button" onClick={onClick}>
      <img className="add-icon" src={addIcon} alt="Add" />
      <div className="menu">
        <Link href={newResourceHref}>
          <NoteAddIcon />
          New Resource
        </Link>
        <Link href={newCollectionHref}>
          <LibraryAddIcon />
          New Collection
        </Link>
      </div>
    </div>
  )
}

export default AddButton

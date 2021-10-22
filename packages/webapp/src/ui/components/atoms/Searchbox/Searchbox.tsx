import { ChangeEventHandler, FC, useCallback } from 'react'
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg'
import './styles.scss'

export type SearchboxProps = {
  searchText: string
  placeholder: string
  size?: 'small' | 'big' 
  setSearchText(text: string): unknown
}

export const Searchbox: FC<SearchboxProps> = ({ searchText, placeholder, size, setSearchText }) => {
  const setSearchTextCB = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ev => setSearchText(ev.currentTarget.value),
    [setSearchText],
  )

  return (
    <div className={`searchbox size-${size}`}>
      <SearchIcon/>
      <input
        className="search-text"
        placeholder={placeholder}
        autoFocus
        defaultValue={searchText}
        onChange={setSearchTextCB}
      />
    </div>
  )
}

Searchbox.defaultProps = {
  size: 'small'
}

export default Searchbox

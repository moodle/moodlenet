import { ChangeEventHandler, FC, useCallback } from 'react'
import searchIcon from '../../../assets/icons/search.svg'
import './styles.scss'

export type SearchboxProps = {
  searchText: string
  placeholder: string
  setSearchText(text: string): unknown
}

export const Searchbox: FC<SearchboxProps> = ({ searchText, placeholder, setSearchText }) => {
  const setSearchTextCB = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ev => setSearchText(ev.currentTarget.value),
    [setSearchText],
  )
  return (
    <div className="searchbox">
      <img className="big-search-icon" src={searchIcon} alt="Search" />
      <div className="search-box">
        <img className="search-icon" src={searchIcon} alt="Search" />
        <input
          className="search-text"
          placeholder={placeholder}
          autoFocus
          defaultValue={searchText}
          onChange={setSearchTextCB}
        />
      </div>
    </div>
  )
}

export default Searchbox

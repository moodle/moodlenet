import {
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg'
import { elementFullyInViewPort } from '../../../helpers/utilities.js'
import PrimaryButton from '../PrimaryButton/PrimaryButton.js'
import './Searchbox.scss'

export type SearchboxProps = {
  searchText: string
  placeholder: string
  setSearchText(text: string): unknown
  search(text: string): unknown
  setIsSearchboxInViewport?: Dispatch<SetStateAction<boolean>>
  size?: 'small' | 'big'
  marginTop?: number
}

export const Searchbox: FC<SearchboxProps> = ({
  searchText,
  placeholder,
  size,
  marginTop,
  search,
  setSearchText,
  setIsSearchboxInViewport,
}) => {
  const setSearchTextCB = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ev => setSearchText(ev.currentTarget.value),
    [setSearchText],
  )
  const searchboxRef = useRef<HTMLDivElement>(null)

  const setElementFullyInViewPort = useCallback(() => {
    if (setIsSearchboxInViewport) {
      searchboxRef.current && elementFullyInViewPort(searchboxRef.current, { marginTop: marginTop })
        ? setIsSearchboxInViewport(true)
        : setIsSearchboxInViewport(false)
    }
  }, [searchboxRef, marginTop, setIsSearchboxInViewport])

  useEffect(() => {
    setIsSearchboxInViewport && window.addEventListener('scroll', setElementFullyInViewPort, true)
    return () => {
      setIsSearchboxInViewport &&
        document.removeEventListener('scroll', setElementFullyInViewPort, true)
    }
  }, [setElementFullyInViewPort, setIsSearchboxInViewport])

  return (
    <div className={`searchbox size-${size}`} ref={searchboxRef}>
      <SearchIcon />
      <label htmlFor="search-text" className="sr-only" hidden>
        Search
      </label>
      <input
        className="search-text"
        id="search-text"
        placeholder={placeholder}
        autoFocus
        // defaultValue={''}
        defaultValue={searchText}
        onChange={setSearchTextCB}
        onKeyDown={e => e.code === 'Enter' && search(searchText)}
      />
      <PrimaryButton
        onClick={() => search(searchText)}
        // {...(size === 'small' ? { color: 'blue' } : {})}
      >
        <span>Search</span>
        <SearchIcon />
      </PrimaryButton>
    </div>
  )
}

Searchbox.defaultProps = {
  size: 'small',
}

Searchbox.displayName = 'LandingPage'
export default Searchbox

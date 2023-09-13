/* eslint-disable @typescript-eslint/no-unused-vars */
// import { SvgIconTypeMap } from '@material-ui/core'
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons'
import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import type { SelectorProps } from '../../../lib/selector.js'
import { Selector, useSelectorOption } from '../../../lib/selector.js'

import RoundButton from '../RoundButton/RoundButton.js'
import './Dropdown.scss'
import { setListPosition } from './utils.js'

export type DropdownProps = SelectorProps & {
  pills: ReactNode
  searchByText?: ((text: string) => unknown) | undefined
  searchText?: string
  label?: string
  edit?: boolean
  error?: ReactNode
  highlight?: boolean
  multilines?: boolean
  noBorder?: boolean
  divRef?: React.RefObject<HTMLDivElement>
  abbr?: string
  position?: { top?: number; bottom?: number }
}
export const Dropdown: FC<DropdownProps> = props => {
  const {
    children,
    pills: _pills,
    searchByText: _searchByText,
    searchText: _searchText,
    label: _label,
    edit: _edit,
    error: _error,
    highlight: _highlight,
    noBorder: _noBorder,
    multilines: _multilines,
    divRef: _divRef,
    abbr: _abbr,
    position: _position,
    ...selectorProps
  } = props
  return (
    <Selector {...selectorProps}>
      <DropdownComp {...props}>{children}</DropdownComp>
    </Selector>
  )
}

const DropdownComp: FC<DropdownProps> = props => {
  const {
    pills,
    highlight,
    noBorder,
    error,
    multilines,
    edit,
    label,
    searchByText,
    disabled,
    className,
    hidden,
    children,
    multiple,
    searchText,
    placeholder,
    divRef,
    abbr,
    position,
  } = props

  const [showContentFlag, toggleOpen] = useReducer(_ => !_, false)
  const [isHoveringOptions, setHoveringOptions] = useState(false)
  const [errorLeaves, setErrorLeave] = useState<boolean>(false)
  const [currentError, setcurrentError] = useState<ReactNode>(undefined)

  const showContent = edit && showContentFlag

  const dropdownContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clickOutListener = (event: MouseEvent) => {
      const div = divRef ? divRef.current : dropdownContainerRef.current
      !((div && div.contains(event.target as Node)) || div === event.target) &&
        showContent &&
        toggleOpen()
    }
    window.addEventListener('click', clickOutListener)
    return () => window.removeEventListener('click', clickOutListener)
  }, [divRef, showContent])

  const setLayout = useCallback(() => {
    showContent &&
      setListPosition({
        dropdownButton,
        dropdownContent,
        topPosition: position && position.top,
        bottomPosition: position && position.bottom,
        window,
        label: !!label,
      })
  }, [showContent, position, label])

  useLayoutEffect(() => {
    showContent && setLayout()
    window.addEventListener('scroll', setLayout)
    window.addEventListener('resize', setLayout)
    return () => {
      window.removeEventListener('scroll', setLayout)
      window.removeEventListener('resize', setLayout)
    }
  }, [setLayout, showContent])

  useLayoutEffect(() => {
    showContent && dropdownButton.current?.focus()
  }, [showContent])
  useEffect(() => {
    !showContent && searchByText?.('')
  }, [showContent, searchByText])

  useEffect(() => {
    if (error) {
      setErrorLeave(false)
      setcurrentError(error)
    } else {
      if (currentError) {
        setErrorLeave(true)
        setTimeout(() => {
          setcurrentError(undefined)
        }, 500)
      } else {
        setcurrentError(undefined)
      }
    }
  }, [error, setErrorLeave, currentError])

  const dropdownButton = useRef<HTMLInputElement>(null)
  const dropdownContent = useRef<HTMLInputElement>(null)

  // const contentLength: number = children && Array.isArray(children) && children[1].length

  return (
    <abbr
      className={`dropdown ${className ? className : ''} ${searchByText ? 'search' : ''}${
        disabled ? ' disabled' : ''
      } ${highlight || error ? ' highlight' : ''} ${!errorLeaves && error ? 'enter-error' : ''} ${
        errorLeaves ? 'leave-error' : ''
      }`}
      ref={divRef ?? dropdownContainerRef}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
      title={abbr}
    >
      {label && <label>{label}</label>}
      <div
        onClick={showContent ? undefined : toggleOpen}
        onFocus={showContent ? undefined : toggleOpen}
        className={`input-container${disabled || !edit ? ' not-editing' : ''}${
          highlight ? ' highlight' : ''
        }${noBorder ? ' no-border' : ''}`}
        tabIndex={!disabled && !showContent ? 0 : undefined}
      >
        {showContent ? (
          <>
            <input
              ref={dropdownButton}
              className={`dropdown-button search-field  ${disabled || !edit ? 'not-editing' : ''}`}
              placeholder={placeholder}
              onInput={({ currentTarget }) => searchByText?.(currentTarget.value)}
              onClick={showContent ? _ => _.stopPropagation() : undefined}
              onBlur={showContent && isHoveringOptions ? undefined : toggleOpen}
              disabled={disabled || !edit}
              defaultValue={searchText}
            />
            <ExpandLessIcon onClickCapture={toggleOpen} />
          </>
        ) : (
          <>
            <div
              className={`dropdown-button ${multiple ? 'multiple' : 'single'} 
              ${multilines ? 'multilines' : ''} 
              ${multiple && !multilines ? 'scroll' : ''}
              `}
            >
              {pills ? pills : <div className="placeholder">{placeholder}</div>}
            </div>
            {!disabled && edit && <ExpandMoreIcon />}
          </>
        )}
      </div>
      {currentError && !disabled && <div className={`error-msg`}>{currentError}</div>}

      {showContent && (
        // contentLength > 0 &&
        <div
          ref={dropdownContent}
          onMouseEnter={() => setHoveringOptions(true)}
          onMouseLeave={() => setHoveringOptions(false)}
          className="dropdown-content"
          tabIndex={-1}
          onClick={_ => {
            _.stopPropagation()
            !multiple && toggleOpen()
          }}
        >
          {children}
        </div>
      )}
    </abbr>
  )
}

export const SimplePill: FC<{
  value: string
  label: ReactNode
  edit?: boolean
  abbr?: string
}> = ({ label, value, edit, abbr }) => {
  const { toggle } = useSelectorOption(value) ?? {}
  const title = abbr ? abbr : typeof label === 'string' ? label : undefined
  return (
    <abbr title={title} className="dropdown-pill">
      <div className="label">{label}</div>
      {edit && <RoundButton onClick={toggle} />}
    </abbr>
  )
}

export const IconPill: FC<{
  icon: ReactNode
  abbr?: string
}> = ({ icon, abbr }) => {
  return (
    <abbr title={abbr} className="dropdown-pill icon">
      {icon}
    </abbr>
  )
}

export const IconTextPill: FC<{
  icon: ReactNode
  label: string
  abbr?: string
}> = ({ icon, label, abbr }) => {
  const title = abbr ? abbr : typeof label === 'string' ? label : undefined
  return (
    <abbr className="dropdown-pill icon-text" title={title}>
      {icon}
      <span>{label}</span>
    </abbr>
  )
}

export type SimpleTextOptionProps = {
  value: string
  abbr?: string
}
export const SimpleTextOption: FC<SimpleTextOptionProps> = ({ value, abbr }) => {
  const { toggle, selected } = useSelectorOption(value) ?? {}
  const title = abbr ? abbr : typeof value === 'string' ? value : undefined
  return (
    <abbr
      title={title}
      key={value}
      className={`${selected ? 'selected ' : ''}option only-text`}
      onClick={toggle}
    >
      {value}
    </abbr>
  )
}

export type TextOptionProps = {
  value: string
  label: string
  abbr?: string
}
export const TextOption: FC<TextOptionProps> = ({ value, label, abbr }) => {
  const { toggle, selected } = useSelectorOption(value) ?? {}
  const title = abbr ? abbr : typeof label === 'string' ? label : undefined
  return (
    <abbr
      key={value}
      title={title}
      className={`${selected ? 'selected ' : ''} option only-text`}
      onClick={toggle}
    >
      {label}
    </abbr>
  )
}

export type IconTextOptionProps = {
  value: string
  label: string
  icon: ReactNode
  abbr?: string
}
export const IconTextOption: FC<IconTextOptionProps> = ({ value, label, icon, abbr }) => {
  const { toggle, selected } = useSelectorOption(value) ?? {}
  const title = abbr ? abbr : typeof label === 'string' ? label : undefined
  return (
    <abbr
      title={title}
      key={value}
      className={`${selected ? 'selected ' : ''} option icon-and-text`}
      onClick={toggle}
    >
      {icon}
      <span>{label}</span>
    </abbr>
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExpandLess, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { SelectorProps } from '../../../lib/selector.js'
import { Selector, useSelectorOption } from '../../../lib/selector.js'

import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'
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
  dropdownButton?: ReactNode
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
    dropdownButton: _dropdownButton,
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
    dropdownButton: DropdownButton,
  } = props

  const [isShowingContent, setShowingContent] = useState(false)
  const [isHoveringOptions, setHoveringOptions] = useState(false)
  const [errorLeaves, setErrorLeave] = useState<boolean>(false)
  const [currentError, setcurrentError] = useState<ReactNode>(undefined)
  // const [multilineHeight, setMultilineHeight] = useState(0)

  const showContent = edit && isShowingContent

  const dropdownContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clickOutListener = (event: MouseEvent) => {
      const div = divRef ? divRef.current : dropdownContainerRef.current
      !((div && div.contains(event.target as Node)) || div === event.target) &&
        showContent &&
        setShowingContent(false)
    }
    window.addEventListener('click', clickOutListener)
    return () => window.removeEventListener('click', clickOutListener)
  }, [divRef, showContent])

  // useEffect(() => {
  //   const clickOutListener = () => {
  //     isShowingContent && toggleIsShowingContent()
  //   }
  //   window.addEventListener('click', clickOutListener)
  //   return () => window.removeEventListener('click', clickOutListener)
  // }, [isShowingContent])
  // const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownButtonRef = useRef<HTMLInputElement>(null)
  const dropdownContentRef = useRef<HTMLInputElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const multilinesRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  // const height = multilinesRef.current?.clientHeight
  // if (multilines && height && height !== 0) {
  //   height < 46 ? 46 : setMultilineHeight(height)
  // }
  // }, [multilines, multilinesRef.current?.clientHeight, isShowingContent])

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  //     setShowingContent(false)
  //   }
  // }

  // useEffect(() => {
  //   const handleDocumentClick = (event: MouseEvent) => {
  //     handleClickOutside(event)
  //   }

  //   document.addEventListener('click', handleDocumentClick)

  //   return () => {
  //     document.removeEventListener('click', handleDocumentClick)
  //   }
  // }, [])

  const setLayout = useCallback(() => {
    isShowingContent &&
      setListPosition({
        dropdownButtonRef,
        dropdownContentRef,
        topPosition: position && position.top,
        bottomPosition: position && position.bottom,
        window,
        label: !!label,
      })
  }, [isShowingContent, position, label])

  useLayoutEffect(() => {
    isShowingContent && setLayout()
    window.addEventListener('scroll', setLayout)
    window.addEventListener('resize', setLayout)
    return () => {
      window.removeEventListener('scroll', setLayout)
      window.removeEventListener('resize', setLayout)
    }
  }, [setLayout, isShowingContent])

  useLayoutEffect(() => {
    isShowingContent && dropdownButtonRef.current?.focus()
  }, [isShowingContent])
  useEffect(() => {
    !isShowingContent && searchByText?.('')
  }, [isShowingContent, searchByText])

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

  return (
    <abbr
      // ref={dropdownRef}
      className={`dropdown ${className ? className : ''} ${searchByText ? 'search' : ''}${
        disabled ? ' disabled' : ''
      } ${highlight || error ? ' highlight' : ''} ${!errorLeaves && error ? 'enter-error' : ''} ${
        errorLeaves ? 'leave-error' : ''
      }`}
      ref={divRef ?? dropdownContainerRef}
      style={{
        visibility: hidden ? 'hidden' : 'visible',
        // height: multilines ? `${28 + multilineHeight}px` : undefined,
      }}
      hidden={hidden}
      title={abbr}
    >
      {label && <label>{label}</label>}
      <div
        ref={inputContainerRef}
        onClick={e => {
          if (!isShowingContent) e.stopPropagation()
          setShowingContent(true)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && !isShowingContent) e.stopPropagation()
          setShowingContent(true)
        }}
        onBlur={isShowingContent ? undefined : () => setShowingContent(false)}
        className={`input-container${disabled || !edit ? ' not-editing' : ''} ${
          highlight ? ' highlight' : ''
        }
          ${multilines ? ' multilines' : ''} 
         ${noBorder ? ' no-border' : ''}
        ${showContent ? ' showing-content' : ''}
        `}
        tabIndex={!disabled && !isShowingContent ? 0 : undefined}
      >
        {isShowingContent ? (
          <>
            <input
              ref={dropdownButtonRef}
              className={`dropdown-button search-field  ${disabled || !edit ? 'not-editing' : ''}`}
              placeholder={placeholder}
              onInput={({ currentTarget }) => searchByText?.(currentTarget.value)}
              onClick={isShowingContent ? _ => _.stopPropagation() : undefined}
              onBlur={
                isShowingContent && isHoveringOptions ? undefined : () => setShowingContent(false)
              }
              // onKeyDownCapture={e => {
              //   if (e.key === 'Down') {
              //     dropdownContentRef.current?.focus()
              //     console.log('down pressed')
              //   }
              // }}
              disabled={disabled || !edit}
              defaultValue={searchText}
            />
            <ExpandLess className="less-arrow" onClickCapture={() => setShowingContent(false)} />
          </>
        ) : (
          DropdownButton ?? (
            <>
              <div
                ref={multilinesRef}
                className={`dropdown-button ${multiple ? 'multiple' : 'single'} 
              ${multilines ? 'multilines' : ''} 
              ${multiple && !multilines ? 'scroll' : ''}
              `}
              >
                {pills && !(Array.isArray(pills) && pills.length === 0) ? (
                  pills
                ) : (
                  <div className="placeholder">{placeholder}</div>
                )}
              </div>
              {!disabled && edit && <ExpandMoreIcon className="open-arrow" />}
            </>
          )
        )}
      </div>
      {currentError && !disabled && <div className={`error-msg`}>{currentError}</div>}

      {isShowingContent && (
        // contentLength > 0 &&
        <div
          ref={dropdownContentRef}
          onMouseEnter={() => setHoveringOptions(true)}
          onMouseLeave={() => setHoveringOptions(false)}
          className="dropdown-content"
          tabIndex={-1}
          onClick={_ => {
            _.stopPropagation()
            !multiple && setShowingContent(false)
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
      {edit && (
        <RoundButton
          className="remove"
          onClick={e => {
            toggle && toggle()
            e.stopPropagation()
            console.log('deleting')
          }}
        />
      )}
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
export type CheckmarkOptionProps = {
  value: string
  label: string
  abbr?: string
}
export const CheckmarkOption: FC<CheckmarkOptionProps> = ({ value, label, abbr }) => {
  const { toggle, selected } = useSelectorOption(value) ?? {}
  const title = abbr ? abbr : typeof label === 'string' ? label : undefined
  return (
    <abbr
      key={value}
      title={title}
      className={`${selected ? 'selected ' : ''} option checkmark`}
      onClick={toggle}
    >
      {selected ? <CheckBox /> : <CheckBoxOutlineBlank />}
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

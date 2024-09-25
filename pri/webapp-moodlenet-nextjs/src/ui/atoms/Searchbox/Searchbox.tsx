'use client'
// import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg'
import SearchIconSVG from '../../lib/assets/icons/search.svg'
// import Image from 'next/image'
import { DetailedHTMLProps, InputHTMLAttributes, PropsWithChildren, ReactNode, useRef } from 'react'
import { PrimaryButton, PrimaryButtonProps } from '../../atoms/PrimaryButton/PrimaryButton'
import { isEnterKeyEv } from '../../lib/keyboard'
import './Searchbox.scss'
export type triggerProps = PropsWithChildren<{ label?: ReactNode } & PrimaryButtonProps>
export type searchboxProps = {
  boxSize?: 'small' | 'big'
  slots?: Record<'left' | 'right', ReactNode>
  triggerOnEnter?: boolean
  triggerBtn?: boolean | triggerProps
  search(text: string): void
  icon?: boolean
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export default function Searchbox({
  boxSize = 'small',
  slots,
  triggerOnEnter = true,
  triggerBtn,
  search,
  icon,
  ...inputProps
}: searchboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className={`searchbox size-${boxSize}`}>
      {icon && <SearchIcon />}
      {slots?.left}
      <label htmlFor="search-text" className="sr-only" hidden>
        {inputProps.placeholder}
      </label>

      <input
        ref={inputRef}
        className="search-text"
        id="search-text"
        {...inputProps}
        onKeyDown={
          !inputProps.disabled
            ? e => {
                // console.log(inputRef.current, e)
                triggerOnEnter && isEnterKeyEv(e) && triggerSearch()
                inputProps.onKeyDown?.(e)
              }
            : undefined
        }
      />
      {slots?.right}
      {triggerBtn && <TriggerButton {...(triggerBtn === true ? {} : triggerBtn)} />}
    </div>
  )
  function SearchIcon() {
    return <SearchIconSVG />
    // return <Image src={SearchIconSVG} alt={t('Search')} />
  }
  function triggerSearch() {
    search(inputRef.current?.value ?? '??')
  }

  function TriggerButton({ children, ...priProps }: triggerProps) {
    return (
      <PrimaryButton
        {...priProps}
        onClick={e => {
          triggerSearch()
          priProps.onClick?.(e)
        }}
      >
        {priProps.label && <span>{priProps.label}</span>}
        {children}
        <SearchIcon />
      </PrimaryButton>
    )
  }
}

'use client'
// import { ReactComponent as SearchIcon } from '@/assets/icons/search.svg'
import SearchIconSVG from '@/assets/icons/search.svg'
// import Image from 'next/image'
import { UiSlots } from '@/lib-ui/utils/types'
import { DetailedHTMLProps, InputHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import PrimaryButton, { PrimaryButtonProps } from '../PrimaryButton/PrimaryButton'
import './Searchbox.scss'

export type SearchboxProps = {
  boxSize?: 'small' | 'big'
  slots?: UiSlots<'left' | 'right'>
  trigger?: TriggerProps
  icon?: boolean
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export default function Searchbox({
  icon,
  trigger,
  boxSize = 'small',
  slots,
  ...inputProps
}: SearchboxProps) {
  return (
    <div className={`searchbox size-${boxSize}`}>
      {icon && <SearchIcon />}
      {slots?.left}
      <label htmlFor="search-text" className="sr-only" hidden>
        {inputProps.placeholder ?? 'Search'}
      </label>
      <input className="search-text" id="search-text" {...inputProps} />
      {slots?.right}
      {trigger && <TriggerButton {...trigger} />}
    </div>
  )
}

type TriggerProps = PropsWithChildren<{ text?: ReactNode } & PrimaryButtonProps>

export function TriggerButton({ text, children, ...priProps }: TriggerProps) {
  return (
    <PrimaryButton {...priProps}>
      <span>{text}</span>
      {children}
      <SearchIcon />
    </PrimaryButton>
  )
}

export function SearchIcon() {
  return <SearchIconSVG />
}

import { _any, _nullish } from '@moodle/lib-types'
import { createContext, forwardRef, useCallback, useContext, useLayoutEffect, useMemo, useReducer, useState } from 'react'
import { useForwardedRef } from './hooks'

export type SelectorProps = Omit<
  React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
  'value' | 'defaultValue' | 'multiple'
> & {
  optionValues: string[]
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onItem?(action: 'select' | 'deselect', value: string): undefined | boolean | void
} & (
    | {
        multiple: true
        value?: string[] | _nullish
        defaultValue?: string[] | _nullish
      }
    | {
        multiple?: false | undefined
        value?: string | _nullish
        defaultValue?: string | _nullish
      }
  )

export type SelectorCtxType = {
  selections: string[]
  toggleOption(optionValue: string): void
  selectOption(optionValue: string): void
  deselectOption(optionValue: string): void
}

export const SelectorContext = createContext<null | SelectorCtxType>(null)
export const useMaybeSelectorContext = () => useContext(SelectorContext)
export const useSelectorContext = () => {
  const ctx = useContext(SelectorContext)
  if (!ctx) {
    throw new Error('useSelectorContext called outside of SelectorContext.Provider')
  }
  return ctx
}

export const useSelectorOption = (optionValue: string) => {
  const ctx = useSelectorContext()
  const { selections, deselectOption, selectOption, toggleOption } = ctx

  const selected = selections.includes(optionValue)
  return {
    selected,
    selections,
    toggle: () => toggleOption(optionValue),
    select: () => selectOption(optionValue),
    deselect: () => deselectOption(optionValue),
  }
}

export const Selector = forwardRef<HTMLSelectElement, SelectorProps>((props, forwardedSelectRef) => {
  const selectElemRef = useForwardedRef(forwardedSelectRef)
  const [triggerVal, incrTrigger] = useReducer(p => ++p, 0)
  const _default_values = [props.defaultValue ?? props.value ?? []].flat()

  const [selections, setSelections] = useState(_default_values)
  useLayoutEffect(
    () =>
      setSelections(currentSelections => {
        if (!selectElemRef.current) {
          return currentSelections
        }
        const selectedOptions = Array.from(selectElemRef.current.options)
          .filter(({ selected }) => selected)
          .map(({ value }) => value)
        const selectionsEquals =
          selectedOptions.length === currentSelections.length &&
          selectedOptions.reduce((eq, newSelections_el, index) => eq && newSelections_el === currentSelections[index], true)
        const newSelections = selectionsEquals ? currentSelections : selectedOptions
        !newSelections.length && (selectElemRef.current.value = '')
        return newSelections
      }),
    [selectElemRef, triggerVal],
  )
  useLayoutEffect(
    () => {
      const selectElem = selectElemRef.current
      if (!selectElem) {
        return
      }
      Array.from(selectElemRef.current.options).forEach(
        optionElem => (optionElem.selected = _default_values.includes(optionElem.value)),
      )

      !_default_values.length && (selectElem.value = '')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      /* just once */
    ],
  )

  const doChangeAndFire = useCallback(
    (action: 'select' | 'deselect' | 'toggle') => (optionValue: string) => {
      const selectElem = selectElemRef.current
      if (!selectElem) {
        return
      }
      const optionElemList = Array.from(selectElem.options)
      const targetOptionElem = optionElemList.find(({ value }) => value === optionValue)
      if (!targetOptionElem) {
        return
      }
      const isSelected = targetOptionElem.selected
      const itemAction = action === 'toggle' ? (isSelected ? 'deselect' : 'select') : action
      if ((itemAction === 'deselect' && !isSelected) || (itemAction === 'select' && isSelected)) {
        return
      }
      const isSelectAction = itemAction === 'select'
      const currentlySelectedAmount = optionElemList.filter(({ selected }) => selected).length
      const shouldResetValue = currentlySelectedAmount <= 1 && !isSelectAction
      const shouldAbort = props.onItem?.(itemAction, optionValue)
      if (shouldAbort === false) {
        return
      }
      targetOptionElem.selected = isSelectAction
      shouldResetValue && (selectElem.value = '')
      fireEvent(selectElemRef.current, 'change')
      incrTrigger()
    },
    [props, selectElemRef],
  )
  // console.log(`selections-${props.name}`, selections)
  const ctx: SelectorCtxType = useMemo(() => {
    return {
      selections,
      toggleOption: doChangeAndFire('toggle'),
      selectOption: doChangeAndFire('select'),
      deselectOption: doChangeAndFire('deselect'),
    }
  }, [doChangeAndFire, selections])

  const { children, onItem, optionValues, value: _value, defaultValue: _defaultValue, ...selectProps } = props
  const value = _value ?? undefined
  const defaultValue = _defaultValue ?? undefined
  return (
    <>
      <select
        {...selectProps}
        value={value}
        defaultValue={defaultValue}
        ref={selectElemRef}
        style={{ display: 'none', visibility: 'hidden' }}
        hidden={true}
      >
        {optionValues.map(optionValue => (
          <option key={optionValue} value={optionValue} />
        ))}
      </select>
      <SelectorContext.Provider value={ctx}>{props.children}</SelectorContext.Provider>
    </>
  )
})
Selector.displayName = 'Selector'

function fireEvent(element: HTMLSelectElement, event: string) {
  const ieDoc = document as _any
  if (ieDoc.createEventObject) {
    // dispatch for IE
    const evt = ieDoc.createEventObject()
    return (element as _any).fireEvent('on' + event, evt)
  } else {
    const evt = new Event(event, { bubbles: true, cancelable: true })
    return !element.dispatchEvent(evt)
  }
}

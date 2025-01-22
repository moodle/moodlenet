import { any_, nullish } from '@moodle/lib-types'
import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react'
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
        value?: string[] | nullish
        defaultValue?: string[] | nullish
      }
    | {
        multiple?: false | undefined
        value?: string | nullish
        defaultValue?: string | nullish
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
  const {
    children,
    onItem,
    optionValues,
    value: ___temp___value,
    defaultValue: ___temp___defaultValue,
    ...selectProps
  } = props
  const { multiple } = props

  const value = ___temp___value ?? undefined
  const defaultValue = ___temp___defaultValue ?? undefined

  if ('value' in props && 'defaultValue' in props) {
    console.error(`Selector [${props.name}] value and defaultValue are mutually exclusive\nfix to avoid unexpected behavior`)
  }
  const ___last___controlled = 'value' in props
  const { current: controlled } = useRef(___last___controlled)
  if (___last___controlled !== controlled) {
    console.error(
      `Selector [${props.name}] controlled can't change, but it changed from ${___last___controlled} to ${controlled}\nfix to avoid unexpected behavior`,
    )
  }

  const [selections, setSelections] = useState([(controlled ? value : defaultValue) ?? []].flat())

  const controlledSelections = controlled && [value ?? []].flat()
  const controlledValuesStr = JSON.stringify(controlledSelections)
  const [prevControlledValuesStr, setPrevControlledValuesStr] = useState(controlledValuesStr)
  if (controlledSelections && controlledValuesStr !== prevControlledValuesStr) {
    // console.info(
    //   `Selector [${props.name}] controlled value changed from ${prevControlledValuesStr} to ${controlledValuesStr}`,
    // )
    setPrevControlledValuesStr(controlledValuesStr)
    setSelections(controlledSelections)
  }

  // console.log(`${props.name}:: selections: ${JSON.stringify(selections)}, defaultValue: ${defaultValue}, value: ${value}`)

  useEffect(() => {
    const selectElem = selectElemRef.current
    if (!selectElem) {
      return
    }
    Array.from(selectElem.options).forEach(optionElem => (optionElem.selected = selections.includes(optionElem.value)))

    selectElem.value = selections[0] ?? ''
  }, [selections, selectElemRef])

  // console.log(`selections-${props.name}`, selections)
  const ctx: SelectorCtxType = useMemo(() => {
    return {
      selections,
      toggleOption: doChangeAndFire('toggle'),
      selectOption: doChangeAndFire('select'),
      deselectOption: doChangeAndFire('deselect'),
    }

    function doChangeAndFire(action: 'select' | 'deselect' | 'toggle') {
      return (optionValue: string) => {
        const selectElem = selectElemRef.current
        if (!selectElem) {
          return
        }
        const isSelected = selections.includes(optionValue)
        const itemAction = action === 'toggle' ? (isSelected ? 'deselect' : 'select') : action
        if ((itemAction === 'deselect' && !isSelected) || (itemAction === 'select' && isSelected)) {
          return
        }
        const shouldAbort = onItem?.(itemAction, optionValue)
        if (shouldAbort === false) {
          return
        }
        const newSelections = multiple
          ? itemAction === 'deselect'
            ? selections.filter(s => s !== optionValue)
            : [...selections, optionValue]
          : itemAction === 'deselect'
            ? []
            : [optionValue]
        Array.from(selectElem.options).forEach(
          optionElem => (optionElem.selected = newSelections.includes(optionElem.value)),
        )
        selectElem.value = newSelections[0] as any_
        setSelections(newSelections)
        fireEvent(selectElem, 'change')
      }
    }
  }, [onItem, selectElemRef, selections, multiple])

  return (
    <>
      <select
        {...selectProps}
        {...(onItem && {
          onChange: e => {
            selectProps.onChange?.(e)
          },
        })}
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
  const ieDoc = document as any_
  if (ieDoc.createEventObject) {
    // dispatch for IE
    const evt = ieDoc.createEventObject()
    return (element as any_).fireEvent('on' + event, evt)
  } else {
    const evt = new Event(event, { bubbles: true, cancelable: true })
    return !element.dispatchEvent(evt)
  }
}

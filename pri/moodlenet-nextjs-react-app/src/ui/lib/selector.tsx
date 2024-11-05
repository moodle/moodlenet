import type { DetailedHTMLProps, FC, SelectHTMLAttributes } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export type SelectorProps = Omit<
  React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
  'value' | 'defaultValue' | 'multiple'
> & {
  onItemSelect?(value: string): void
  onItemDeselect?(value: string): void
} & (
    | {
        multiple: true
        value?: string[] | undefined
        defaultValue?: string[] | undefined
      }
    | {
        multiple?: false | undefined
        value?: string | undefined
        defaultValue?: string | undefined
      }
  )

export type SelectorOption = {
  toggle(): unknown
  select(): unknown
  deselect(): unknown
  selected: boolean
  selections: string[]
}
export type SelectorCtxType = {
  selections: string[]
  toggleOption(optionValue: string, selected: boolean): unknown
  selectOption(optionValue: string): unknown
  deselectOption(optionValue: string): unknown
}

export const SelectorContext = createContext<null | SelectorCtxType>(null)
export const useSelectorContext = () => useContext(SelectorContext)

const empty: string[] = []
type RawValueType = undefined | string | string[]
const normalizeValue = (val: RawValueType) =>
  Array.isArray(val)
    ? val
    : !val // consider empty string as no value
      ? empty
      : [val]

const doRawValuesEquals = (ra1: RawValueType, ra2: RawValueType) => {
  const a1 = normalizeValue(ra1)
  const a2 = normalizeValue(ra2)
  return a1.length === a2.length && a1.reduce((eq, a1_el, index) => eq && a1_el === a2[index], true)
}

export const useSelectorOption = (optionValue: string) => {
  const ctx = useSelectorContext()
  if (!ctx) {
    return null
  }
  const { selections, deselectOption, selectOption, toggleOption } = ctx

  const selected = selections.includes(optionValue)
  return {
    selected,
    selections,
    toggle: () => toggleOption(optionValue, selected),
    select: () => selectOption(optionValue),
    deselect: () => deselectOption(optionValue),
  }
}
export const Selector: FC<SelectorProps> = props => {
  const selectElemRef = useRef<HTMLSelectElement>(null)
  const { multiple } = props
  const [selections, setSelections] = useState(() => normalizeValue(props.defaultValue))

  useLayoutEffect(() => {
    if (!selectElemRef.current) {
      return
    }

    const normalizedPropsValue = normalizeValue(props.value)

    if (doRawValuesEquals(normalizedPropsValue, selections)) {
      return
    }

    setSelections(normalizedPropsValue)
  }, [props.value, selections])

  useLayoutEffect(() => {
    if (!selectElemRef.current) {
      return
    }
    const empty = () => {
      selectElemRef.current &&
        Array.from(selectElemRef.current.options).forEach(opt =>
          selectElemRef.current?.removeChild(opt),
        )
    }

    empty()
    selections.forEach((selectionValue: string) => {
      const optElem = createOptionElem(selectionValue)
      selectElemRef.current?.appendChild(optElem)
    })
    return empty
  }, [selections])

  const fireChange = useCallback(() => {
    if (!selectElemRef.current) {
      return
    }
    fireEvent(selectElemRef.current, 'change')
  }, [])

  const deselectOption = useCallback(
    (optionValue: string) => {
      if (!selectElemRef.current) {
        return
      }
      const optionToDeselect = Array.from(selectElemRef.current.options).find(
        ({ value }) => value === optionValue,
      )
      if (!optionToDeselect) {
        return
      }
      props.onItemDeselect?.(optionValue)

      selectElemRef.current.removeChild(optionToDeselect)
      fireChange()
    },
    [fireChange, props],
  )

  const selectOption = useCallback(
    (optionValue: string) => {
      if (!selectElemRef.current) {
        return
      }
      const alreadySelectedOptionEl = Array.from(selectElemRef.current.options).find(
        ({ value }) => value === optionValue,
      )
      if (alreadySelectedOptionEl) {
        return
      }
      const optElem = createOptionElem(optionValue)
      props.onItemSelect?.(optionValue)
      if (!multiple) {
        Array.from(selectElemRef.current.options).forEach(opt =>
          selectElemRef.current?.removeChild(opt),
        )
      }
      selectElemRef.current.appendChild(optElem)
      fireChange()
    },
    [fireChange, multiple, props],
  )

  const toggleOption = useCallback(
    (optionValue: string, selected: boolean) => {

      if (!selectElemRef.current) {
        return
      }
      selected ? deselectOption(optionValue) : selectOption(optionValue)
    },
    [deselectOption, selectOption],
  )

  const ctx: SelectorCtxType = useMemo(
    () => ({
      selections,
      toggleOption,
      selectOption,
      deselectOption,
    }),
    [deselectOption, selectOption, selections, toggleOption],
  )

  // NOTE: Is it correct (let control select up if value is set ) ?
  // or remove defaultValue and force it to be controlled here ?

  const value_prop =
    'value' in props
      ? {
          value: props.value,
        }
      : 'defaultValue' in props
        ? {}
        : {
            value: props.multiple ? ctx.selections : ctx.selections[0],
          }
  const defaultValue_prop =
    'defaultValue' in props
      ? {
          defaultValue: props.defaultValue,
        }
      : {}
  const {
    defaultValue: _defaultValue,
    value: _value,
    children: _children,
    onItemSelect: _onItemSelect,
    onItemDeselect: _onItemDeselect,
    ...restProps
  } = props
  const selectProps: DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > = {
    ref: selectElemRef,
    style: { display: 'none', visibility: 'hidden' },
    hidden: true,
    ...restProps,
    ...value_prop,
    ...defaultValue_prop,
  }
  return (
    <SelectorContext.Provider value={ctx}>
      {props.children}
      <select {...selectProps} disabled />
    </SelectorContext.Provider>
  )
}

function createOptionElem(value: string) {
  const optElem = document.createElement('option')
  optElem.value = optElem.innerText = value
  optElem.selected = true
  return optElem
}

function fireEvent(element: HTMLSelectElement, event: string) {
  const ieDoc = document as any
  if (ieDoc.createEventObject) {
    // dispatch for IE
    const evt = ieDoc.createEventObject()
    return (element as any).fireEvent('on' + event, evt)
  } else {
    const evt = new Event(event, { bubbles: true, cancelable: true })
    return !element.dispatchEvent(evt)
  }
}

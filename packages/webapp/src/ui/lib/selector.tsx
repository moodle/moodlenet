import {
  createContext,
  DetailedHTMLProps,
  FC,
  SelectHTMLAttributes,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export type SelectorProps = Omit<
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >,
  'value' | 'defaultValue' | 'multiple'
> &
  (
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
}
export type SelectorCtxType = {
  selections: string[]
  useSelectorOption(value: string): SelectorOption
}
export const SelectorContext = createContext<SelectorCtxType>(null as any)

export const useSelectorOption = (value: string) =>
  useContext(SelectorContext).useSelectorOption(value)

export const useSelections = () => useContext(SelectorContext).selections
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
  return (
    a1.length === a2.length &&
    a1.reduce((eq, a1_el, index) => eq && a1_el === a2[index], true)
  )
}
export const Selector: FC<SelectorProps> = (props) => {
  const selectRef = useRef<HTMLSelectElement>(null)
  const { multiple } = props
  const [selections, setSelections] = useState(() =>
    normalizeValue(props.defaultValue)
  )

  useLayoutEffect(() => {
    if (!selectRef.current) {
      return
    }

    const normalizedPropsValue = normalizeValue(props.value)

    if (doRawValuesEquals(normalizedPropsValue, selections)) {
      return
    }

    setSelections(normalizedPropsValue)
  }, [props.value, selections])
  useLayoutEffect(() => {
    if (!selectRef.current) {
      return
    }
    const empty = () => {
      selectRef.current &&
        Array.from(selectRef.current.options).forEach((opt) =>
          selectRef.current?.removeChild(opt)
        )
    }

    empty()
    selections.forEach((selectionValue: string) => {
      const optElem = createOptionElem(selectionValue)
      selectRef.current?.appendChild(optElem)
    })
    return empty
  }, [selections])

  const ctx: SelectorCtxType = useMemo(() => {
    return {
      selections,
      useSelectorOption: (optionValue) => {
        const selected = selections.includes(optionValue)
        const fire = useCallback(() => {
          if (!selectRef.current) {
            return
          }
          fireEvent(selectRef.current, 'change')
        }, [])

        const deselect = useCallback(() => {
          if (!selectRef.current) {
            return
          }
          const optionToDeselect = Array.from(selectRef.current.options).find(
            ({ value }) => value === optionValue
          )
          if (!optionToDeselect) {
            return
          }
          selectRef.current.removeChild(optionToDeselect)
          fire()
        }, [fire, optionValue])

        const select = useCallback(() => {
          if (!selectRef.current) {
            return
          }
          const alreadySelectedOptionEl = Array.from(
            selectRef.current.options
          ).find(({ value }) => value === optionValue)
          if (alreadySelectedOptionEl) {
            return
          }
          const optElem = createOptionElem(optionValue)
          if (!multiple) {
            Array.from(selectRef.current.options).forEach((opt) =>
              selectRef.current?.removeChild(opt)
            )
          }
          selectRef.current.appendChild(optElem)
          fire()
        }, [fire, optionValue])

        const toggle = useCallback(() => {
          if (!selectRef.current) {
            return
          }
          selected ? deselect() : select()
        }, [deselect, select, selected])

        return {
          toggle,
          selected,
          select,
          deselect,
        }
      },
    }
  }, [selections, multiple])

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
  const { defaultValue, value: _value, children, ...restProps } = props
  const selectProps: DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > = {
    ref: selectRef,
    style: { display: 'none', visibility: 'hidden' },
    hidden: true,
    ...restProps,
    ...value_prop,
    ...defaultValue_prop,
  }
  return (
    <SelectorContext.Provider value={ctx}>
      {props.children}
      <select {...selectProps} />
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

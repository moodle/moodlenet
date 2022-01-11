import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
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
export type SelectorCtxType = {
  selections: string[]
  useSelectorOption(_: string): {
    toggle(): unknown
    select(): unknown
    deselect(): unknown
    selected: boolean
  }
}
export const SelectorContext = createContext<SelectorCtxType>(null as any)

export const useSelectorOption = (value: string) =>
  useContext(SelectorContext).useSelectorOption(value)

export const useSelections = () => useContext(SelectorContext).selections

type RawValueType = undefined | string | string[]
const normalizeValue = (val: RawValueType) =>
  Array.isArray(val) ? val : typeof val === 'undefined' ? [] : [val]

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

  const [selections, setSelections] = useState(() =>
    normalizeValue(props.defaultValue)
  )

  useEffect(() => {
    const selectElem = selectRef.current
    if (!selectElem) {
      return
    }
    selections.forEach((selectionValue: string) => {
      const optElem = createOptionElem(selectionValue)
      selectElem.appendChild(optElem)
    })

    return () => {
      Array.from(selectElem.options).forEach((opt) =>
        selectElem.removeChild(opt)
      )
    }
  }, [selections])

  useEffect(() => {
    const selectElem = selectRef.current
    if (!selectElem) {
      return
    }

    const normalizedPropsValue = normalizeValue(props.value)

    if (doRawValuesEquals(normalizedPropsValue, selections)) {
      return
    }

    setSelections(normalizedPropsValue)
  }, [props.value, selections])

  const ctx: SelectorCtxType = useMemo(() => {
    return {
      selections,
      useSelectorOption: (optionValue) => {
        const selected = selections.includes(optionValue)
        const selectElem = selectRef.current
        const fire = useCallback(() => {
          if (!selectElem) {
            return
          }
          fireEvent(selectElem, 'change')
          fireEvent(selectElem, 'input')
        }, [selectElem])

        const deselect = useCallback(() => {
          if (!selectElem) {
            return
          }
          const optionEl = Array.from(selectElem.options).find(
            ({ value }) => value === optionValue
          )
          optionEl && selectElem.removeChild(optionEl)
          fire()
        }, [fire, optionValue, selectElem])

        const select = useCallback(() => {
          if (!selectElem) {
            return
          }
          const alreadySelectedOptionEl = Array.from(selectElem.options).find(
            ({ value }) => value === optionValue
          )
          if (alreadySelectedOptionEl) {
            return
          }
          const optElem = createOptionElem(optionValue)
          selectElem.appendChild(optElem)
          fire()
        }, [fire, optionValue, selectElem])

        const toggle = useCallback(() => {
          if (!selectElem) {
            return
          }
          if (props.multiple) {
            selected ? deselect() : select()
          } else {
            if (!selected) {
              Array.from(selectElem.options).forEach((opt) =>
                selectElem.removeChild(opt)
              )
              select()
            }
          }
        }, [deselect, select, selectElem, selected])

        return {
          toggle,
          selected,
          select,
          deselect,
        }
      },
    }
  }, [selections, props.multiple])

  return (
    <SelectorContext.Provider value={ctx}>
      {props.children}
      <select
        {...props}
        value={props.multiple ? ctx.selections : ctx.selections[0]}
        ref={selectRef}
        children={undefined}
        style={{ display: 'none', visibility: 'hidden' }}
        hidden
      ></select>
    </SelectorContext.Provider>
  )
}

function createOptionElem(value: string) {
  const optElem = document.createElement('option')
  // optElem.value = optElem.innerText = value
  optElem.value = value
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

import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'

export type SelectorProps = Omit<
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >,
  'value' | 'multiple'
> &
  (
    | {
        multiple: true
        value?: string[]
      }
    | {
        multiple?: false | undefined
        value?: string | undefined
      }
  )
export type SelectorCtxType = {
  selections: string[]
  useSelectorOption(_: string): { toggle(): unknown; selected: boolean }
}
export const SelectorContext = createContext<SelectorCtxType>(null as any)

export const useSelectorOption = (value: string) =>
  useContext(SelectorContext).useSelectorOption(value)

export const useSelections = () => useContext(SelectorContext).selections

export const Selector: FC<SelectorProps> = ({ children, ...selectProps }) => {
  // console.log(selectProps.value)
  const { multiple, value: selectPropsValue } = selectProps
  const selectRef = useRef<HTMLSelectElement>(null)

  const ctx: SelectorCtxType = useMemo(() => {
    const selections = Array.isArray(selectPropsValue)
      ? selectPropsValue
      : typeof selectPropsValue === 'string'
      ? [selectPropsValue]
      : []
    return {
      selections,
      useSelectorOption: (optionValue) => {
        //console.log("reg", opt);
        const selected = !!selections.includes(optionValue)

        const toggle = useCallback(() => {
          //  console.log("select-action", value, selectRef.current);
          const selectElem = selectRef.current
          if (!selectElem) {
            return
          }
          if (multiple) {
            if (selected) {
              const optionEl = Array.from(selectElem.options).find(
                ({ value }) => value === optionValue
              )
              optionEl && selectElem.removeChild(optionEl)
            } else {
              const optElem = createOptionElem(optionValue)
              selectElem.appendChild(optElem)
            }
          } else {
            if (!selected) {
              Array.from(selectElem.options).forEach((opt) =>
                selectElem.removeChild(opt)
              )
              // if (!selected && !SelectorSingleSelectionOption.toggleSelected)
              const optElem = createOptionElem(optionValue)
              selectElem.appendChild(optElem)
            }
          }

          fireEvent(selectElem, 'change')
          fireEvent(selectElem, 'input')
        }, [optionValue, selected])

        return {
          toggle,
          selected,
        }
      },
    }
  }, [selectPropsValue, multiple])

  useEffect(() => {
    const selectElem = selectRef.current
    if (!selectElem) {
      return
    }
    const currValuesSortedStr = JSON.stringify(ctx.selections)

    const optionValuesStr = JSON.stringify(
      Array.from(selectElem.options).map(({ value }) => value)
    )

    if (currValuesSortedStr === optionValuesStr) {
      return
    }

    ctx.selections.forEach((selectionValue: string) => {
      const optElem = createOptionElem(selectionValue)
      selectElem.appendChild(optElem)
    })

    return () => {
      Array.from(selectElem.options).forEach((opt) =>
        selectElem.removeChild(opt)
      )
    }
  }, [ctx.selections])

  return (
    <>
      <SelectorContext.Provider value={ctx}>
        {children}
        <select
          {...selectProps}
          value={multiple ? ctx.selections : ctx.selections[0]}
          ref={selectRef}
          children={undefined}
          style={{ display: 'none' }}
        ></select>
      </SelectorContext.Provider>
    </>
  )
}

function createOptionElem(value: string) {
  const optElem = document.createElement('option')
  optElem.value = optElem.innerText = value
  optElem.selected = true
  return optElem
}
// export const getValues = (_:string|string[]|undefined)=>Array.isArray(_)?_:'string' === typeof _?[_]:[]
function fireEvent(element: HTMLSelectElement, event: string) {
  const ieDoc = document as any
  if (ieDoc.createEventObject) {
    // dispatch for IE
    const evt = ieDoc.createEventObject()
    return (element as any).fireEvent('on' + event, evt)
  } else {
    // dispatch for firefox + others
    // const evt = document.createEvent('HTMLEvents')
    // evt.initEvent(event, true, true) // event type,bubbling,cancelable

    const evt = new Event(event, { bubbles: true, cancelable: true })
    return !element.dispatchEvent(evt)
  }
}

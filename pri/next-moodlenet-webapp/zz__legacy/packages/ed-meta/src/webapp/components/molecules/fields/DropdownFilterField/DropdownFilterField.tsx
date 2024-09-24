import type {
  DropdownProps,
  IconTextOptionProps,
  TextOptionProps,
} from '@moodlenet/component-library'
import { Dropdown, PrimaryButton, SecondaryButton, TextOption } from '@moodlenet/component-library'
import { ArrowDropDown } from '@mui/icons-material'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { isValidElement, useCallback, useRef, useState } from 'react'
import './DropdownFilterField.scss'

export type DropdownFilterFieldProps = Omit<
  DropdownProps,
  'multiple' | 'value' | 'defaultValue' | 'pills'
> & {
  defaultValue?: string[]
  selected: string[]
  options: (TextOptionProps | IconTextOptionProps)[]
  highlightInitialSelection?: boolean
  title: string
  setSelected(selected: string[]): void
}

export const DropdownFilterField: FC<DropdownFilterFieldProps> = props => {
  const {
    options,
    selected,
    setSelected,
    title,
    highlightInitialSelection = false,
    ...dropdownProps
  } = props
  const [searchText, setSearchText] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownButtonRef = useCallback((node: HTMLElement) => {
    if (!node) return
    const resizeObserver = new ResizeObserver(() => {
      const element = dropdownRef.current
      if (element && node.clientWidth !== 0) element.style.width = `${node.clientWidth}px`
    })

    resizeObserver.observe(node)
  }, [])

  const form = useFormik<{ selected: string[] }>({
    initialValues: { selected },
    enableReinitialize: true,
    onSubmit: values => {
      setSelected(values.selected)
    },
  })

  const currentSelected = options.find(opt => opt.value === form.values.selected[0])
  const selectedLabel =
    currentSelected && 'icon' in currentSelected ? currentSelected.icon : currentSelected?.label

  const dropdownButton =
    form.values.selected.length > 0 || highlightInitialSelection ? (
      <PrimaryButton innerRef={dropdownButtonRef}>
        {form.values.selected.length === 1 &&
        selectedLabel &&
        ((typeof selectedLabel === 'string' && selectedLabel.length < 9) ||
          isValidElement(selectedLabel)) ? (
          selectedLabel
        ) : (
          <>
            {title} <div className="num-selected-elements">{form.values.selected.length}</div>
          </>
        )}
        <ArrowDropDown />
      </PrimaryButton>
    ) : (
      <SecondaryButton innerRef={dropdownButtonRef}>
        {title} <ArrowDropDown />
      </SecondaryButton>
    )

  const updatedElements = {
    opts: options.filter(
      o =>
        o.label.toUpperCase().includes(searchText.toUpperCase()) ||
        o.value.toUpperCase().includes(searchText.toUpperCase()),
    ),
    selected: options.filter(
      ({ value }) =>
        form.values.selected.includes(value) &&
        value.toUpperCase().includes(searchText.toUpperCase()),
    ),
  }

  return (
    <Dropdown
      {...dropdownProps}
      divRef={dropdownRef}
      dropdownButton={dropdownButton}
      name="selected"
      value={form.values.selected}
      className="dropdown-filter-field"
      onChange={e => {
        form.handleChange(e)
        form.submitForm()
      }}
      multiple
      position={{ top: 38, bottom: 25 }}
      searchByText={setSearchText}
      pills={[]}
      placeholder={title}
      edit
    >
      {updatedElements.selected.map(selected => (
        <TextOption key={selected.value} value={selected.value} label={selected.label} />
      ))}
      {updatedElements.opts
        .filter(subject => !updatedElements.selected.includes(subject))
        .map(selected => (
          <TextOption key={selected.value} label={selected.label} value={selected.value} />
        ))}
    </Dropdown>
  )
}

DropdownFilterField.defaultProps = {}

export default DropdownFilterField

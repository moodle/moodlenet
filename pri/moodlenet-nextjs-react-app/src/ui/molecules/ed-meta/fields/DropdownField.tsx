import { isNotNullish } from '@moodle/lib-types'
import { forwardRef, useState } from 'react'
import { Dropdown, DropdownProps, SimplePill, TextOption, TextOptionProps } from '../../../atoms/Dropdown/Dropdown'
import { useSelectorContext } from '../../../lib/selector'

export type DropdownFieldProps = {
  options: TextOptionProps[]
  shouldShowErrors?: boolean
} & Omit<DropdownProps, 'pills' | 'optionValues'>

export const DropdownField = forwardRef<HTMLSelectElement, DropdownFieldProps>(function DropdownField(
  { options, shouldShowErrors = false, ...dropdownProps },
  forwardedRef,
) {
  /*
  const [updatedElements, setUpdatedElements] = useState({
    opts: options,
    selected: options.find(
      ({ value }) => (dropdownProps.defaultValue === undefined ? dropdownProps.value : dropdownProps.defaultValue) === value,
    ),
  })
  useEffect(() => {
    setUpdatedElements({
      opts: options,
      selected: options.find(({ value }) => dropdownProps.value === value),
    })
  }, [dropdownProps.value, options])

  useEffect(() => {
    setUpdatedElements(curr => ({
      opts: curr.opts.filter(o =>
        `${o.value.toUpperCase()} ${o.label.toUpperCase()} ${o.abbr?.toUpperCase() ?? ''}`.includes(
          searchText.toUpperCase(),
        ),
      ),
      selected: curr.selected,
      // selected: options.find(
        //   ({ value }) => dropdownProps.value === value && value.toUpperCase().includes(searchText.toUpperCase()),
        // ),
        }))
        }, [searchText])
        */
  const [searchText, setSearchText] = useState('')
  return (
    /* dropdownProps.edit ?  */ <Dropdown
      ref={forwardedRef}
      {...(dropdownProps as DropdownProps)}
      optionValues={options.map(({ value }) => value)}
      highlight={shouldShowErrors && !!dropdownProps.error}
      error={shouldShowErrors && dropdownProps.error}
      // position={{ top: 50, bottom: 25 }}
      searchByText={setSearchText}
      pills={<Pills options={options} placeholder={dropdownProps.placeholder} />}
    >
      <Options options={options} textSearch={searchText} />
    </Dropdown>
  ) /*  : updatedElements.selected ? (
    <div className={`detail selection ${dropdownProps.disabled ? 'disabled' : ''}`}>
      <div className="title">{dropdownProps.label}</div>
      <abbr className="value" title={updatedElements.selected.label}>
        {updatedElements.selected.label}
      </abbr>
    </div>
  ) : null */
})
export default DropdownField

function filterSearchMatches(searchText?: string) {
  return (opt?: TextOptionProps): opt is TextOptionProps =>
    !opt
      ? false
      : !searchText
        ? true
        : `${opt.value.toUpperCase()} ${opt.label.toUpperCase()} ${opt.abbr?.toUpperCase() ?? ''}`.includes(
            searchText.toUpperCase(),
          )
}
function Options({ options, textSearch }: { textSearch: string; options: TextOptionProps[] }) {
  const { selections } = useSelectorContext()
  return (
    <>
      {selections
        .map(value => options.find(o => o.value === value))
        .filter(filterSearchMatches(textSearch))
        .map(selectedOpt => (
          <TextOption key={selectedOpt.value} value={selectedOpt.value} label={selectedOpt.label} />
        ))}
      {options
        .filter(({ value }) => !selections.includes(value))
        .filter(filterSearchMatches(textSearch))
        .map(option => {
          return <TextOption key={option.value} value={option.value} label={option.label} />
        })}
    </>
  )
}

function Pills({ options, placeholder }: { placeholder: string | undefined; options: TextOptionProps[] }) {
  const { selections } = useSelectorContext()
  return (
    <>
      {selections.length
        ? selections
            .map(value => options.find(o => o.value === value))
            .filter(isNotNullish)
            .map(selectedOpt => <SimplePill key={selectedOpt.value} value={selectedOpt.value} label={selectedOpt.label} />)
        : placeholder}
    </>
  )
}

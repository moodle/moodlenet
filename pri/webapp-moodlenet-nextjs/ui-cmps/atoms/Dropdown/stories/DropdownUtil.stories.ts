import { action } from '@storybook/addon-actions'
import type { ChangeEvent, ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'

export const useStoriesDDCtrl = ({
  options,
  initialSelectionIndexes,
}: {
  options: [key: string, label: string, icon?: ReactNode][]
  initialSelectionIndexes: number[] | undefined
}) => {
  const [value, setValue] = useState(
    initialSelectionIndexes && initialSelectionIndexes.map(index => options[index]![0]),
  )
  const [filterString, setFilterString] = useState<string>('')

  const selectedOpts = useMemo(
    () => value && value.map(val => options.find(([optVal]) => optVal === val)!),
    [options, value],
  )
  const filteredOpts = useMemo(
    () =>
      options.filter(
        ([value, label]) =>
          new RegExp(filterString, 'ig').test(label) || new RegExp(filterString, 'ig').test(value),
      ),
    [filterString, options],
  )

  const onChange = useCallback(({ currentTarget }: ChangeEvent<HTMLSelectElement>) => {
    const newVal = Array.from(currentTarget.selectedOptions).map(({ value }) => value)
    action('useStoriesDDCtrl onChange')(newVal)
    setValue(newVal)
  }, [])

  const setFilter = useCallback((filter: string) => {
    action('useStoriesDDCtrl setFilter')(filter)
    setFilterString(filter)
  }, [])

  return useMemo(() => {
    return {
      onChange,
      selectedOpts,
      value,
      setValue,
      filterString,
      setFilter,
      filteredOpts,
    }
  }, [filterString, filteredOpts, selectedOpts, onChange, setFilter, value])
}

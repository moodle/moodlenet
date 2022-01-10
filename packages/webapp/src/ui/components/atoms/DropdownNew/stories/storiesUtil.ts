import { action } from '@storybook/addon-actions'
import { ChangeEvent, ReactNode, useMemo, useState } from 'react'

export const useStoriesDDCtrl = ({
  options,
  initialSelectionIndexes,
}: {
  options: [key: string, label: string, icon?: ReactNode][]
  initialSelectionIndexes: number[]
}) => {
  const [value, setValue] = useState(
    initialSelectionIndexes.map((index) => options[index]![0])
  )
  const [filterString, setFilterString] = useState<string>('')

  return useMemo(() => {
    const filteredOpts = options.filter(
      ([value, label]) =>
        new RegExp(filterString, 'ig').test(label) ||
        new RegExp(filterString, 'ig').test(value)
    )

    const onChange = ({ currentTarget }: ChangeEvent<HTMLSelectElement>) => {
      const newVal = Array.from(currentTarget.selectedOptions).map(
        ({ value }) => value
      )
      action('useStoriesDDCtrl onChange')(newVal)
      setValue(newVal)
    }

    const getOptionHeader = (value: string) =>
      options
        .filter(([val]) => val === value)
        .map(([, value, icon]) => [value, icon] as const)[0]!

    const setFilter = (filter: string) => {
      action('useStoriesDDCtrl setFilter')(filter)
      setFilterString(filter)
    }

    return {
      onChange,
      getOptionHeader,
      value,
      setValue,
      filter: filterString,
      setFilter,
      filteredOpts,
    }
  }, [filterString, options, value])
}

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
  const [filter, setFilter] = useState<string>('')

  return useMemo(() => {
    const filteredOpts = options.filter(
      ([value, label]) =>
        new RegExp(filter, 'ig').test(label) ||
        new RegExp(filter, 'ig').test(value)
    )

    const onChange = ({ currentTarget }: ChangeEvent<HTMLSelectElement>) => {
      setValue(
        Array.from(currentTarget.selectedOptions).map(({ value }) => value)
      )
    }

    const getOptionHeader = (value: string) =>
      options
        .filter(([val]) => val === value)
        .map(([, value, icon]) => [value, icon] as const)[0]!

    return {
      onChange,
      getOptionHeader,
      value,
      setValue,
      filter,
      setFilter,
      filteredOpts,
    }
  }, [filter, options, value])
}

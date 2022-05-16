import { t } from '@lingui/macro'
import { TextOptionProps } from '../../../atoms/Dropdown/Dropdown'

export const MonthTextOptionProps: TextOptionProps[] = [
  { value: `0`, label: t`January` },
  { value: `1`, label: t`February` },
  { value: `2`, label: t`March` },
  { value: `3`, label: t`April` },
  { value: `4`, label: t`May` },
  { value: `5`, label: t`June` },
  { value: `6`, label: t`July` },
  { value: `7`, label: t`August` },
  { value: `8`, label: t`September` },
  { value: `9`, label: t`October` },
  { value: `10`, label: t`November` },
  { value: `11`, label: t`December` },
]
export const YearsProps: string[] = [
  '2000',
  '2001',
  '2002',
  '2003',
  '2004',
  '2005',
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
].reverse()

export const TypeTextOptionProps: TextOptionProps[] = [
  { value: '1', label: `type 1` },
  { value: '2', label: `type 2` },
  { value: '3', label: `type 3` },
  { value: '4', label: `type 4` },
  { value: '5', label: `type 5` },
  { value: '6', label: `type 6` },
  { value: '7', label: `type 7` },
  { value: '8', label: `type 8` },
]

export const LevelTextOptionProps: TextOptionProps[] = [
  { value: '0.1', label: t`Early childhood educational development` },
  { value: '0.2', label: t`Pre-primary education` },
  { value: '1', label: t`Primary education` },
  { value: '2', label: t`Lower secondary education` },
  { value: '3', label: t`Upper secondary education` },
  { value: '4', label: t`Post-secondary non-tertiary education` },
  { value: '5', label: t`Short-cycle tertiary education` },
  { value: '6', label: t`Bachelor or equivalent` },
  { value: '7', label: t`Master or equivalent` },
  { value: '8', label: t`Doctoral or equivalent` },
]

export const LanguagesTextOptionProps: TextOptionProps[] = [
  { value: 'English', label: t`English` },
  { value: 'Italian', label: t`Italian` },
  { value: 'Greek', label: t`Greek` },
  { value: 'German', label: t`German` },
]

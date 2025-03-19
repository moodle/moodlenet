import { u_entry } from '@moodle/lib-types'
import { ReactElement } from 'react'

export type layoutSlotItem = u_entry<{
  plugin: string
  react: ReactElement
  html: string
}>

import { d_t_u } from '@moodle/lib-types'
import { ReactElement } from 'react'

export type layoutSlotItem = d_t_u<{
  plugin: string
  react: ReactElement
  html: string
}>

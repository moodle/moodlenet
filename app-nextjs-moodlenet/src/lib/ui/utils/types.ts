import { ReactNode } from 'react'
import { plugins } from '../../common/plugins'

export type slots<k extends string> = plugins<k, ReactNode>

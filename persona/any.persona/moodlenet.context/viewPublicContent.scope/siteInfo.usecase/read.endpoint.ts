/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'
import { platformInfo } from './types'

export type read = moo.persona.endpoint<[ZodVoid, { siteInfo: platformInfo }]>

export const read: moo.gate.provider.endpoint<read> = () => E.right({ zod: voidz() })

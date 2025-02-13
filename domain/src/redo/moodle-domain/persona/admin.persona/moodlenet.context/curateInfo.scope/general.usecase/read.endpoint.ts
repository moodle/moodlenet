/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type read = moo.persona.endpoint<[ZodVoid, void, undefined]>

export const read: moo.gate.endpoint<read> = () => E.right({ zod: voidz() })

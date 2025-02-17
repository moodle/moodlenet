/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type read = moo.persona.endpoint<[ZodVoid, void]>

export const read: moo.gate.provider.endpoint<read> = () => E.right({ zod: voidz() })

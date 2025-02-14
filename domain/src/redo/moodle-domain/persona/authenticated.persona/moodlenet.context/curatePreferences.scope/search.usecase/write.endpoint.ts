/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type write = moo.persona.endpoint<[ZodVoid, void]>

export const write: moo.gate.endpoint<write> = () => E.right({ zod: voidz() })

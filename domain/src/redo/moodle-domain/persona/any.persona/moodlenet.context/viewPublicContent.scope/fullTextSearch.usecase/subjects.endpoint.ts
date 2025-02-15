/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type subjects = moo.persona.endpoint<[ZodVoid, void]>

export const subjects: moo.gate.provider.endpoint<subjects> = () => E.right({ zod: voidz() })

/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type about = moo.persona.endpoint<[ZodVoid, void, undefined]>

export const about: moo.gate.endpoint<about> = () => E.right({ zod: voidz() })

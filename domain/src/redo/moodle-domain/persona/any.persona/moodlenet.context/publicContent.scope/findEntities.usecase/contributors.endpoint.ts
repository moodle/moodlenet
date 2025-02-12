/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type contributors = moo.persona.endpoint<[ZodVoid, void, undefined]>

export const contributors: moo.gate.endpoint<contributors> = () => E.right({ zod: voidz() })

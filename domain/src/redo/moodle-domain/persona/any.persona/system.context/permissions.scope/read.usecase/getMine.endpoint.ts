/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type getMine = moo.persona.endpoint<[ZodVoid, { permissions: moo.permissions }, undefined]>

export const getMineGate = (() => E.right({ zod: voidz() })) satisfies moo.gate.endpointProvider<getMine>

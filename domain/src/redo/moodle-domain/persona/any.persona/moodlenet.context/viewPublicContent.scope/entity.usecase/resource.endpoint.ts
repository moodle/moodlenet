/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type resource = moo.persona.endpoint<[ZodVoid, void, undefined]>

export const resource: moo.gate.endpoint<resource> = () => E.right({ zod: voidz() })

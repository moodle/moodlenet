/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type send = moo.persona.endpoint<[ZodVoid, void]>

export const send: moo.gate.provider.endpoint<send> = () => E.right({ zod: voidz() })

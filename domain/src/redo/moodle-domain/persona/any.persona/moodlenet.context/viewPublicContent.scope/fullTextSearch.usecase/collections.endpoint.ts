/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type collections = moo.persona.endpoint<[ZodVoid, void]>

export const collections: moo.gate.provider.endpoint<collections> = () => E.right({ zod: voidz() })

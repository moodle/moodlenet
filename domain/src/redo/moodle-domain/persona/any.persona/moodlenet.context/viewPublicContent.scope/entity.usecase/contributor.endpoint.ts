/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type contributor = moo.persona.endpoint<[ZodVoid, void]>

export const contributor: moo.gate.provider.endpoint<contributor> = () => E.right({ zod: voidz() })

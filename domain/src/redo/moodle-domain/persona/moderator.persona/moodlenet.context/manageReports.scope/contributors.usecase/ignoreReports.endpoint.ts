/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type ignoreReports = moo.persona.endpoint<[ZodVoid, void, undefined]>

export const ignoreReports: moo.gate.endpoint<ignoreReports> = () => E.right({ zod: voidz() })

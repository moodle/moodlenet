/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type ignoreReports = moo.persona.endpoint<[ZodVoid, void]>

export const ignoreReports: moo.gate.provider.endpoint<ignoreReports> = () => E.right({ zod: voidz() })

/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type contributors = moo.persona.endpoint<[ZodVoid, void]>

export const contributors: moo.gate.provider.endpoint<contributors> = () => E.right({ zod: voidz() })

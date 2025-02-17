/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type subject = moo.persona.endpoint<[ZodVoid, void]>

export const subject: moo.gate.provider.endpoint<subject> = () => E.right({ zod: voidz() })

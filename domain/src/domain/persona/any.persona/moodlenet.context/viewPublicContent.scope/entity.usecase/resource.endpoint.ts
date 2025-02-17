/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type resource = moo.persona.endpoint<[ZodVoid, void]>

export const resource: moo.gate.provider.endpoint<resource> = () => E.right({ zod: voidz() })

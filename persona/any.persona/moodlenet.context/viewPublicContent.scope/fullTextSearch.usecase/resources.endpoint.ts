/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type resources = moo.persona.endpoint<[ZodVoid, void]>

export const resources: moo.gate.provider.endpoint<resources> = () => E.right({ zod: voidz() })

/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type edit = moo.persona.endpoint<[ZodVoid, void, undefined]>

export const edit: moo.gate.endpoint<edit> = () => E.right({ zod: voidz() })

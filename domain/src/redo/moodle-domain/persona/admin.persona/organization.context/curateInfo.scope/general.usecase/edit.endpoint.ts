/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'

export type edit = moo.persona.endpoint<[ZodVoid, void]>

export const edit: moo.gate.provider.endpoint<edit> = () => E.right({ zod: voidz() })

import * as E from 'fp-ts/Either'
import { void as voidz, ZodVoid } from 'zod'
import { platformInfo } from '../../../../../model/moodlenet.model'

export type read = moo.def.userType.endpoint<[ZodVoid, { siteInfo: platformInfo }]>

export const read: moo.def.gate.provider.endpoint<read> = () => E.right({ zod: voidz() })

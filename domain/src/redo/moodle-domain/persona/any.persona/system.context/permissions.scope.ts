import { read, readGate } from './permissions.scope/read.usecase'

export type permissions = moo.persona.scope<{ read: read }>

export const permissionsGate: moo.gate.scope<permissions> = { read: readGate }

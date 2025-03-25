import { gateCoreDeps } from '@moodle/domain/lib'

// export type modelConfiguration = {
//   gate: Pick<coreGateDeps, 'modelHandle' | 'loggerProvider'>
//   access: Pick<moo.core.access<any_>, 'sessionInfo'>
// }

// export type coreConfiguration = {
//   gate: Pick<coreGateDeps, 'core' | 'gateProvider' | 'coreAccess'>
//   access: Pick<moo.core.access<any_>, 'id' | 'now'>
// }

// export type accessConfiguration = {
//   model: modelConfiguration
//   core: coreConfiguration
// }

export type configurator = (_: { master: boolean }) => configuration

export type configuration = {
  drain: () => Promise<unknown>
  gate: (_: { gateRequest: moo.def.gate.provider.request }) => Promise<gateCoreDeps>
}

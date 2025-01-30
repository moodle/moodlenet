/* eslint-disable @typescript-eslint/no-invalid-void-type */

declare module 'moodle-domain' {
  type DefSystem<systemDef extends SystemDef> = systemDef
  type SystemDef = { model: ModelDef }

  type Model = {
    [systemName in keyof Systems]: Systems[systemName]['model']
  }
}

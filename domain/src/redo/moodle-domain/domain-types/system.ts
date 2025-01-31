/* eslint-disable @typescript-eslint/no-invalid-void-type */

declare module 'moodle-domain' {
  type DefService<serviceDef extends ServiceDef> = serviceDef
  type ServiceDef = { model: ModelDef }

  type Model = {
    [serviceName in keyof Services]: Services[serviceName]['model']
  }
}

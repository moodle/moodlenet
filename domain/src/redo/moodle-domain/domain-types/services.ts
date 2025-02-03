/* eslint-disable @typescript-eslint/no-invalid-void-type */

declare module 'moodle-domain' {
  type DefService<serviceDef extends ServiceDef> = serviceDef
  type ServiceDef = { model: ModelDef; tokens: signedTokensMapDef | never }
  type signedTokensMapDef = {
    [tokenName: string]: unknown
  }
}

export interface Domain {
  version: '5.0'
  personas: Personas
  model: Model
}

declare const _persona_type_placeholder_sym: unique symbol
export type personaType = string & keyof Personas
export interface Personas {
  [_persona_type_placeholder_sym]?: never
}

declare const _module_name_placeholder_sym: unique symbol
export type moduleName = string & keyof Model
export interface Model {
  [_module_name_placeholder_sym]?: never
}

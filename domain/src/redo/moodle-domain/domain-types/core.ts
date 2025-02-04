/* eslint-disable @typescript-eslint/no-invalid-void-type */

declare module 'moodle-domain' {
  // type PersonaCtx<personaDef extends PersonaDef> = {
  // _: personaDef['model']
  type CoreCtx = {
    _: Model
    on: <typeModelRef extends TypeModel<TypeModelTraits>>(
      typeModelRef: typeModelRef | undefined,
    ) => TypeModelRefOpMap_Impl<typeModelRef>
  }

  type Core = (ctx: CoreCtx /* <personaDef> */) => Gate

  type TypeModelRefOpMap_Impl<typeModelRef extends TypeModel<TypeModelTraits>> =
    typeModelRef extends TypeModel<infer traits>
      ? traits['ops'] extends infer opTraits
        ? opTraits extends TraitsOps
          ? {
              [k in keyof opTraits]: TypeModelRefOp_Impl<opTraits[k]>
            }
          : never
        : never
      : never

  type TypeModelRefOp_Impl<modelOpDef extends ModelOpDef> = modelOpDef[0] extends 'query'
    ? {
        query: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
      }
    : modelOpDef[0] extends 'async' | 'sync'
      ? {
          async: (message: modelOpDef[1]) => Promise<void>
        } & (modelOpDef[0] extends 'sync'
          ? {
              sync: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
            }
          : unknown)
      : never
}

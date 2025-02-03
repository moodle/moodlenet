/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { map } from '@moodle/lib-types'
import type { OPS } from '../../lib/constants'

declare module 'moodle-domain' {
  type DefModel<modelDef extends ModelDef> = modelDef
  type ModelDef = map

  // type ___<typeModelRef extends TypeModel<TypeModelTraits>> = Exclude<typeModelRef, undefined>


  type Model_Impl<baseModelNode = Services> = {
    [k in keyof baseModelNode]: baseModelNode[k] extends infer modelNode
      ? modelNode extends TypeModel<TypeModelTraits>
        ? TypeModel_Impl<modelNode>
        : Model_Impl<modelNode>
      : never // or maybe `unknown` instead ?
  }

  type TypeModel_Impl<modelNode extends TypeModel<TypeModelTraits>> = {
    [OPS]: TypeModelOps_Impl<modelNode>
  } & (modelNode extends IdSpaceMap<infer space_shape, infer space_ops>
    ? { _: (id: string) => TypeModel_Impl<ModelSpace<space_shape, space_ops>> }
    : Model_Impl<Omit<modelNode, typeof model_traits_sym>>)

  type TypeModelOps_Impl<modelNode extends TypeModel<TypeModelTraits>> = {
    [opName in keyof modelNode[typeof model_traits_sym]['ops']]: ModelOp_Impl<
      modelNode[typeof model_traits_sym]['ops'][opName]
    >
  }

  type ModelOp_Impl<modelOpDef extends ModelOpDef> = modelOpDef[0] extends 'query'
    ? {
        query?: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
        then?: (outcome: modelOpDef[2], message: modelOpDef[1]) => Promise<void>
      }
    : modelOpDef[0] extends 'sync' | 'async'
      ? {
          cmd?: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
          then?: (outcome: modelOpDef[2], message: modelOpDef[1]) => Promise<void>
        }
      : unknown
}

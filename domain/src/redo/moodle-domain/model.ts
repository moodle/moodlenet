/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { map } from '@moodle/lib-types'
import { moduleName, Model } from './domain'
import { IdSpaceMap, model_traits_sym, ModelOpDef, ModelSpace, ModelType, ModelTypeTraits } from './model-type'

export const OPS = Symbol('ModelType operations impl symbol')
export const NO_JOB_HERE = void 0 as never
export type DefModel<modelDef extends map> = modelDef

// type ___<modelTypeRef extends ModelType<ModelTypeTraits>> = Exclude<modelTypeRef, undefined>

export type ModuleModel_Impl<module_name extends moduleName> = Model_Impl<Model[module_name]>

export type Model_Impl<baseModelNode = Model> = {
  [k in keyof baseModelNode]: baseModelNode[k] extends infer modelNode
    ? modelNode extends ModelType<ModelTypeTraits>
      ? ModelType_Impl<modelNode>
      : Model_Impl<modelNode>
    : never // else : unknown
}

type ModelType_Impl<modelTypeNode extends ModelType<ModelTypeTraits>> = {
  [OPS]: ModelTypeOps_Impl<modelTypeNode>
} & (modelTypeNode extends IdSpaceMap<infer space_shape, infer space_ops>
  ? { _: (id: string) => ModelType_Impl<ModelSpace<space_shape, space_ops>> }
  : Model_Impl<Omit<modelTypeNode, typeof model_traits_sym>>)

type ModelTypeOps_Impl<modelTypeNode extends ModelType<ModelTypeTraits>> = {
  [opName in keyof modelTypeNode[typeof model_traits_sym]['ops']]: modelTypeNode[typeof model_traits_sym]['ops'][opName] extends infer op
    ? op extends ModelOpDef
      ? ModelOp_Impl<op>
      : never
    : never
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


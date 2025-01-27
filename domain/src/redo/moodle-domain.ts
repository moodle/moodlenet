/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { fileMeta } from '@moodle/lib-domain-fs'
import { any_, d_u, map, serializable_object } from '@moodle/lib-types'
import { externalAsset } from '../modules/storage'

declare const _placeholder_sym: unique symbol
declare const model_traits_sym: unique symbol

export const OPS = Symbol('ModelType operations impl symbol')
export const NO_JOB_HERE = void 0 as never

type modelTypeName = keyof ModelTypeMap
interface ModelTypeMap<args extends map = never> {
  id_space_map: { shape: unknown; ops: { exists: [{ id: string }, { exists: boolean }, 'query'] } }
  fs_file: {
    shape: unknown
    ops: { meta: [void, null | fileMeta, 'query'] } & (args['removable'] extends false
      ? unknown
      : {
          remove: [void, void, 'async']
        })
  }
  asset: {
    arags: { removable?: boolean }
    shape: { file: FsFile<args['fileTraits']> }
    ops: {
      fromTempFile: [{ tempId: string }, { fileMeta: fileMeta }, 'async']
      fromUrl: [{ externalAsset: externalAsset }, { fileMeta: fileMeta }, 'async']
    } & (args['removable'] extends false
      ? unknown
      : {
          remove: [void, void, 'async']
        })
  }
  fs_image_file: { shape: unknown; ops: unknown }
  endpoint: { shape: unknown; ops: { do: args['epDef'] } }
  id_space: { shape: unknown; ops: { purge: [void, void, 'async'] } }
  entity_data: {
    shape: unknown
    ops: {
      get: [
        void | { conditions?: args['conditions'] },
        d_u<{ found: { data: args['data'] }; notFound: unknown; conditionsNotMet: unknown }, 'result'>,
        'query',
      ]
      replace: [
        { newData: args['data']; conditions?: args['conditions'] },
        d_u<{ done: unknown; notFound: unknown; conditionsNotMet: unknown }, 'result'>,
        'async',
      ]
    }
  }
  static_data: { shape: unknown; ops: { get: [void, args['data'], 'query'] } }
}

export interface Domain {
  version: '5.0'
  modules: Modules
}

type module_name = string & keyof Modules
export interface Modules {
  [_placeholder_sym]?: never
}

type ModelTypeTraits = { shape: unknown; ops: map<ModelOpDef> }
type ModelType<
  tags extends modelTypeName,
  traits extends Partial<ModelTypeTraits> = ModelTypeTraits,
  args extends map = never,
> = traits['shape'] &
  ModelTypeMap<args>[tags]['shape'] & {
    [model_traits_sym]: { tags: tags; ops: ModelTypeMap<args>[tags]['ops'] & traits['ops'] }
  }

export type IdSpaceMap<
  sub_traits extends Partial<ModelTypeTraits> = ModelTypeTraits,
  ops extends map<ModelOpDef> = map<ModelOpDef>,
> = ModelType<'id_space_map', { ops: ops; shape: map<IdSpace<sub_traits>> }>

type IdSpace<traits extends Partial<ModelTypeTraits> = ModelTypeTraits> = ModelType<'id_space', traits>

export type EntityData<
  data extends serializable_object,
  args extends { conditions?: map } | unknown = unknown,
  traits extends Partial<ModelTypeTraits> = ModelTypeTraits,
> = ModelType<'entity_data', traits, args & { data: data }>

export type StaticData<
  data extends serializable_object,
  args extends { conditions?: map } | unknown = unknown,
  traits extends Partial<ModelTypeTraits> = ModelTypeTraits,
> = ModelType<'static_data', traits, args & { data: data }>

export type Asset<
  args extends { removable?: boolean } = { removable: true },
  traits extends Partial<ModelTypeTraits> = ModelTypeTraits,
> = ModelType<'asset', traits, args>

type FsFile<
  args extends { removable?: boolean } = { removable: true },
  traits extends Partial<ModelTypeTraits> = ModelTypeTraits,
> = ModelType<'fs_file', traits, args>

export type FsImageFile<
  args extends { removable?: boolean },
  traits extends Partial<ModelTypeTraits> = ModelTypeTraits,
> = ModelType<'fs_image_file' | 'fs_file', traits, args>

type modelOpType = 'sync' | 'async' | 'query'
type ModelOpDef = [message: any_, outcome: any_, type: modelOpType]
export type Endpoint<epDef extends ModelOpDef> = ModelType<'endpoint', ModelTypeTraits, { epDef: epDef }>

type EpDef = [message: any_, outcome: any_, _?: unknown]
type epImpl<epDef extends EpDef> = (message: epDef[0]) => Promise<epDef[1]>

type ModuleDef = { useCases: map<map<EpDef>>; model: map }
export type Module<moduleDef extends ModuleDef> = moduleDef

type UseCasesDef = map<EpDef>
export type UseCases<useCaseDef extends UseCasesDef> = useCaseDef

export type Module_Impl<moduleDef extends ModuleDef> = {
  useCases: {
    [useCaseName in keyof moduleDef['useCases']]: UseCases_Impl<moduleDef['useCases'][useCaseName]>
  }
}
export type Core<moduleName extends module_name> = Module_Impl<Modules[moduleName]>

type UseCases_Impl<useCasesDef extends UseCasesDef> = {
  [endpointName in keyof useCasesDef]: UseCase_Endpoint_Impl<useCasesDef[endpointName]>
}

type UseCase_Endpoint_Impl<epDef extends EpDef> = (
  message: unknown,
  ctx: ModuleCtx,
) => Promise<[validatedMessage: epDef[0], endpoint: epImpl<epDef>]>

type ModuleCtx = {
  m: WholeModel
  on: <modelTypeRef extends ModelType<modelTypeName>>(
    modelTypeRef: modelTypeRef | undefined,
  ) => ModelTypeRefOps<modelTypeRef>
}

type ___<modelTypeRef extends ModelType<modelTypeName>> = Exclude<modelTypeRef[typeof model_traits_sym], undefined>
type ModelTypeRefOps<modelTypeRef extends ModelType<modelTypeName>> = ___<modelTypeRef>['ops'] extends infer modelOpDefMap
  ? modelOpDefMap extends map<ModelOpDef>
    ? {
        [k in keyof modelOpDefMap]: modelOpDefMap[k][2] extends 'query'
          ? {
              query: epImpl<modelOpDefMap[k]>
            }
          : modelOpDefMap[k][2] extends 'async' | 'sync'
            ? {
                async: epImpl<[modelOpDefMap[k][0], void]>
              } & (modelOpDefMap[k][2] extends 'sync'
                ? {
                    sync: epImpl<modelOpDefMap[k]>
                  }
                : unknown)
            : never
      }
    : never
  : never

export type WholeModel = {
  [moduleName in module_name]: Modules[moduleName]['model']
}

export type SubModel<moduleName extends module_name> = Model<Modules[moduleName]['model']>

export type Model<baseModelNode = WholeModel> = {
  [k in keyof baseModelNode]: baseModelNode[k] extends infer modelNode
    ? modelNode extends ModelType<modelTypeName>
      ? ModelTypeImpl<modelNode>
      : Model<modelNode>
    : never // else : unknown
}

type ModelTypeImpl<modelTypeNode extends ModelType<modelTypeName>> = {
  [OPS]: TypeOpsImpl<modelTypeNode>
} & (modelTypeNode extends IdSpaceMap<infer sub_traits>
  ? { _: (id: string) => Model<sub_traits['shape']> }
  : Model<Omit<modelTypeNode, typeof model_traits_sym>>)

type TypeOpsImpl<modelTypeNode extends ModelType<modelTypeName>> = {
  [opName in keyof modelTypeNode[typeof model_traits_sym]['ops']]: modelTypeNode[typeof model_traits_sym]['ops'][opName] extends infer op
    ? op extends ModelOpDef
      ? ModelOpImpl<op>
      : never
    : never
}

type ModelOpImpl<op extends ModelOpDef> = op[2] extends 'query'
  ? {
      query?: epImpl<op>
      then?: (outcome: op[1], message: op[0]) => Promise<void>
    }
  : op[2] extends 'sync' | 'async'
    ? {
        cmd?: epImpl<op>
        then?: (outcome: op[1], message: op[0]) => Promise<void>
      }
    : unknown

export type PrimaryAccess = {
  [moduleName in module_name]: {
    [useCaseName in keyof Modules[moduleName]['useCases']]: {
      [endpointName in keyof Modules[moduleName]['useCases'][useCaseName]]: Modules[moduleName]['useCases'][useCaseName][endpointName] extends infer epDef
        ? epDef extends EpDef
          ? epImpl<epDef>
          : never
        : never
    }
  }
}

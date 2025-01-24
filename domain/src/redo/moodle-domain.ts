/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { fileMeta } from '@moodle/lib-domain-fs'
import { any_, map, ok_ko, serializable_object, unsupportedProxyHandler } from '@moodle/lib-types'
import assert from 'assert'

declare const _: unique symbol
declare global {
  namespace moodle {
    type modelTypeName = keyof ModelTypeMap
    interface ModelTypeMap<args extends map = map> {
      id_space_map: { exists: [_: { id: string }, boolean] }
      fs_file: { meta: [void, fileMeta] }
      fs_image_file: unknown
      endpoint: { send: args['epDef'] }
      id_space: { purge: [void, void] }
      data_entity: {
        get: [void | { cond: args['accessConditions'] }, args['data'] | null]
        replace: [{ data: args['data']; cond: args['accessConditions'] }, ok_ko<void>]
      }
      static_data: { get: [void, args['data']] }
    }

    interface Domain {
      version: '5.0'
      modules: Modules
      model: Model
    }
    interface Modules {
      [_]: never
    }
    type Model = {
      [moduleName in keyof Modules]: Modules[moduleName]['model']
    }

    // type dRef<modelRef extends ModelRef<any_, any_>> = modelRef | undefined
    type ModelTypeTraits = map<EndpointDef, string>
    type ModelType<
      tags extends modelTypeName,
      shape = unknown,
      args extends map = map,
      moreTraits extends ModelTypeTraits = map,
    > = shape & {
      [_]?: { tags: tags; traits: ModelTypeMap<args>[tags] & moreTraits; shape: shape }
    }

    type IdSpaceMap<spaceStruct extends map, moreTraits extends ModelTypeTraits = map> = ModelType<
      'id_space_map',
      map<IdSpace<spaceStruct>>,
      never,
      moreTraits
    >

    type IdSpace<spaceStruct extends map, moreTraits extends ModelTypeTraits = map> = ModelType<
      'id_space',
      spaceStruct,
      never,
      moreTraits
    >

    type DataEntity<
      data extends serializable_object,
      accessConditions extends map | never = never,
      moreTraits extends ModelTypeTraits = map,
    > = ModelType<'data_entity', unknown, { data: data; accessConditions: accessConditions }, moreTraits>

    type StaticData<data extends serializable_object, moreTraits extends ModelTypeTraits = map> = ModelType<
      'static_data',
      unknown,
      { data: data },
      moreTraits
    >

    type FsFile<moreTraits extends ModelTypeTraits = map> = ModelType<'fs_file', unknown, never, moreTraits>

    type FsImageFile<moreTraits extends ModelTypeTraits = map> = ModelType<
      'fs_image_file' | 'fs_file',
      unknown,
      never,
      moreTraits
    >

    type epType = 'sync' | 'async'
    type EndpointDef = [message: any_, outcome: any_, type?: epType]
    type Endpoint<epDef extends EndpointDef> = ModelType<'endpoint', unknown, { epDef: epDef }>

    type ep<epDef extends EndpointDef> = (message: epDef[0]) => Promise<epDef[1]>

    type ModuleDef = { useCases: map<map<EndpointDef>>; model: map }
    type Module<moduleDef extends ModuleDef> = moduleDef

    type UseCasesDef = map<EndpointDef>
    type UseCases<useCaseDef extends UseCasesDef> = useCaseDef

    type Module_Impl<moduleDef extends ModuleDef> = {
      useCases: {
        [useCaseName in keyof moduleDef['useCases']]: UseCases_Impl<moduleDef['useCases'][useCaseName]>
      }
    }
    type UseCases_Impl<useCasesDef extends UseCasesDef> = {
      [endpointName in keyof useCasesDef]: UseCase_Endpoint_Impl<useCasesDef[endpointName]>
    }

    // type AccessErrorType = {
    //   invalidMessage: unknown
    //   forbidden: unknown
    //   unauthorized: unknown
    //   notPermitted: unknown
    // }

    // type AccessError = d_u<AccessErrorType, 'type'>
    type UseCase_Endpoint_Impl<epDef extends EndpointDef> = (
      message: unknown,
      ctx: ModuleCtx,
    ) => Promise<[validatedMessage: epDef[0], endpoint: ep<epDef>]>

    // ) => Promise<
    //               ok_ko<
    //                     [
    //                       validatedMessage: epDef[0],
    //                       endpoint: ep<[
    //                                     epDef[0],
    //                                     ok_ko<epDef[1], AccessErrorType>
    //                                   ]>
    //                     ],
    //                     AccessErrorType
    //                   >>

    type ModuleCtx = {
      m: Domain['model']
      s: <dRef extends ModelType<any_>>(
        dRef: dRef | undefined,
      ) => {
        [name in keyof Traits<dRef>]: Traits<dRef>[name][2] extends 'sync' | undefined ? ep<Traits<dRef>[name]> : never
      }
      q: <dRef extends ModelType<any_>>(
        dRef: dRef | undefined,
      ) => {
        // [name in keyof Traits<dRef>]: Traits<dRef>[name][2] extends 'async' ? ep<[Traits<dRef>[name][0], void]> : never
        [name in keyof Traits<dRef>]: ep<[Traits<dRef>[name][0], void]>
      }
    }
    type _<dRef extends ModelType<any_>> = Exclude<dRef[typeof _], undefined>
    type Traits<dRef extends ModelType<any_>> = _<dRef>['traits'] extends infer traits
      ? traits extends ModelTypeTraits
        ? {
            [k in keyof traits]: traits[k] //extends infer trait ? (trait extends EndpointDef ? trait : never) : never
          }
        : never
      : never

    type PrimaryAccess = {
      [moduleName in keyof Modules]: {
        [useCaseName in keyof Modules[moduleName]['useCases']]: {
          [endpointName in keyof Modules[moduleName]['useCases'][useCaseName]]: Modules[moduleName]['useCases'][useCaseName][endpointName] extends infer epDef
            ? epDef extends EndpointDef
              ? ep<epDef>
              : never
            : never
        }
      }
    }
  }
}

const __x: { i: map<{ a: { id: string; c: number } }> } = {
  i: idSpaceMap(id => ({
    a: { id, c: 2 },
  })),
}

__x.i.assa?.a.id
// __x.i.assa?.aa.id

export function idSpaceMap<T extends map>(tf: (id: string) => T): moodle.IdSpaceMap<T> {
  return new Proxy(
    {},
    {
      ...unsupportedProxyHandler,
      get(_, id) {
        assert(typeof id === 'string')
        return tf(id)
      },
    },
  ) as moodle.IdSpaceMap<T>
}

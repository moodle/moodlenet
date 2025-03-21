/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */
import type { any_, map } from '@moodle/lib-types'
import type { ZodType } from 'zod'
declare global {
  namespace moo.def {
    type userType<userTypeDef extends userType_def = userType_def> = userTypeDef
    namespace userType {
      type model<modelScopesDef extends map<scope> = map<scope>> = modelScopesDef
      type scope<scopeDef extends map<usecase> = map<usecase>> = scopeDef
      type usecase<usecaseDef extends map<endpoint> = map<endpoint>> = usecaseDef
      type enpointZodType<endpoint_ extends endpoint> = epZodType<endpoint_[0]>
      type endpointReturn<endpoint_ extends endpoint> = endpoint_[1]
      type endpointFunction<endpoint_ extends endpoint> = (form: endpointFormType<endpoint_>) => Promise<endpointReturn<endpoint_>>
      // (by inputType)type endpointFormType<endpoint_ extends endpoint> = enpointZodType<endpoint_> extends ZodType<any_, any_  , infer inputType > ? inputType : never
      type endpointFormType<endpoint_ extends endpoint> = enpointZodType<endpoint_> extends ZodType<infer outputType, any_, any_> ? outputType : never
      type endpoint<endpointDef_ extends endpointDef = endpointDef> = endpointDef_
    }
  }
}

type zodTypeOrProvider<zt extends ZodType = ZodType> = zt | ((...a: any_[]) => zt)
type epZodType<zp> = zp extends zodTypeOrProvider<infer zt> ? zt : never

type endpointDef = [form: zodTypeOrProvider, outcome: any_]
type userType_def = Partial<map<moo.def.userType.model, moo.names.model>>

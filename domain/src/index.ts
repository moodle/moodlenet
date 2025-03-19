/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */
import '@moodle/lib-types'
export * from './types'

declare global {
  type moo<iface> = {
    [k in keyof iface]: iface[k] //extends primitive | void | any_[] | never ? iface[k] : moo<iface[k]>
  }
  namespace moo {
    type version = '5.0'

    interface UserTypes {}
    interface Models {}
    namespace Models {}

    namespace def {
      type tags<sym extends symbol, t = unknown> = { [k in sym]?: t }
      export namespace tags {
        const configs: unique symbol
        type configs = typeof configs
      }
    }

    namespace names {
      type model = keyof Models // | any_other_string
      type userType = keyof UserTypes // | any_other_string

      type context = {
        [userType_ in names.userType]: string & keyof UserTypes[userType_]
      } extends infer _
        ? string & _[keyof _] //| any_other_string
        : never

      type scope = {
        [userType_ in names.userType]: {
          [ctx in string & keyof UserTypes[userType_]]: string & keyof UserTypes[userType_][ctx]
        } extends infer _
          ? string & _[keyof _]
          : never
      } extends infer _
        ? _[keyof _] //| any_other_string
        : never

      type fullScope = {
        [userType_ in names.userType]: {
          [ctx in string & keyof UserTypes[userType_]]: UserTypes[userType_][ctx]
        } extends infer _
          ? keyof _ extends infer ctxName
            ? ctxName extends string
              ? ctxName extends keyof _
                ? `${ctxName}.${string & keyof _[ctxName]}`
                : never
              : never
            : never
          : never
      } extends infer _
        ? _[keyof _] //| any_other_string
        : never
    }
  }
}

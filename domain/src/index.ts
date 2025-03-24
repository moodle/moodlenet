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

    interface UserType {
      any: moo.def.userType<moo<UserType.Any>>
      anonymous: moo.def.userType<moo<UserType.Anonymous>>
      admin: moo.def.userType<moo<UserType.Admin>>
      authenticated: moo.def.userType<moo<UserType.Authenticated>>
      moderator: moo.def.userType<moo<UserType.Moderator>>
    }
    namespace UserType {
      interface Any {}
      interface Anonymous {}
      interface Admin {}
      interface Authenticated {}
      interface Moderator {}
    }
    interface Models {}
    namespace Models {}

    namespace def {
      type tags<sym extends symbol, t = unknown> = { [k in sym]: t }
      type tagType<of, sym extends symbol> = of extends { [k in sym]: infer typ } ? (typ extends undefined | never ? void : typ) : void
      namespace tags {
        const configs: unique symbol
        type configs = typeof configs

        const context: unique symbol
        type context = typeof context
      }
    }

    namespace names {
      type model = keyof Models // | any_other_string
      type userType = keyof UserType // | any_other_string

      type context = {
        [userType_ in names.userType]: string & keyof UserType[userType_]
      } extends infer _
        ? string & _[keyof _] //| any_other_string
        : never

      type scope = {
        [userType_ in names.userType]: {
          [ctx in string & keyof UserType[userType_]]: string & keyof UserType[userType_][ctx]
        } extends infer _
          ? string & _[keyof _]
          : never
      } extends infer _
        ? _[keyof _] //| any_other_string
        : never

      type fullScope = {
        [userType_ in names.userType]: {
          [ctx in string & keyof UserType[userType_]]: UserType[userType_][ctx]
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

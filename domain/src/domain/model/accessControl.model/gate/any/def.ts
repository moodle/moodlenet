import { ZodVoid } from 'zod'

export type any_def = moo.def.userType.model<
  { [moo.def.tags.configs]: { m: string }; [moo.def.tags.context]: { m1: string } } & {
    policies: moo.def.userType.scope<
      { [moo.def.tags.configs]: { s: string }; [moo.def.tags.context]: { s1: string } } & {
        readMyOwn: moo.def.userType.usecase<
          { [moo.def.tags.configs]: { u: string }; [moo.def.tags.context]: { u1: string } } & {
            policiesInfo: moo.def.userType.endpoint<
              {
                [moo.def.tags.configs]: { e: string }
                [moo.def.tags.context]: { e1: string }
              } & [ZodVoid, { policiesInfo: moo.def.policies.user.info }]
            >
          }
        >
      }
    >
  }
>

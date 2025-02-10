import { integer_schema } from '@moodle/lib-types'
import { object, string } from 'zod'
import { makeGateProxy } from '../moo/lib/gateProxy'
import { Gate } from '../moodle-domain/gate'

const _ = makeGateProxy({
  gateProvider: Gate,
  messageDispatcher: async () => null,
  session: {
    any: {
      _: {
        general: {
          userDataConfigs: {
            displayName: { max: integer_schema.parse(10), min: integer_schema.parse(3) },
            email: { max: integer_schema.parse(10) },
            password: { max: integer_schema.parse(10), min: integer_schema.parse(3) },
          },
        },
      },
      system: { session: { read: { getMine: {} } } },
    },
    anonymous: {
      access: {
        signup: {
          withMyEmail: { confirmMyEmail: {}, submitSignupForm: {} },
        },
      },
    },
  },
})

const ce = _.anonymous?.access?.signup?.withMyEmail?.confirmMyEmail?.zod.safeParse({})
ce?.data?.signupEmailVerificationToken
ce?.error
const sig = _.anonymous?.access?.signup?.withMyEmail?.submitSignupForm?.zod.safeParse({})
sig?.error
sig?.data?.email
const xx = object({ a: string() }).safeParse({})
xx.error

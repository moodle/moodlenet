import { email_address_schema } from '@moodle/lib-types'
import { left, right } from 'fp-ts/Either'
import { some } from 'fp-ts/Option'
import { NO_JOB_HERE } from '../lib/constants'

const _1: moo.model.impl<moo.Models['userAccount']> = {
  user: {
    '_': _id => ({
      email: NO_JOB_HERE,
      permissions: NO_JOB_HERE,
      password: NO_JOB_HERE,
      profile: {
        info: {
          '* replace': async ({
            access: {
              message: _,
              target: { opName: __ },
            },
          }) => {
            return right('done')
          },
          '& replace': async (_outcme, { access: { message: _ } }) => {
            return
          },
        },
        background: NO_JOB_HERE,
        avatar: {
          '* fromTempFile': async ({ access }) => {
            access.message.tempId
            return left('NOT_FOUND')
          },
          'file': NO_JOB_HERE,
        },
      },
    }),
    '* one': async _message => {
      return some({
        id: '22',
        data: {
          email: {
            address: email_address_schema().parse('as'),
          },
          password: { hash: '' },
          profile: {
            avatar: { type: 'none' },
            background: { type: 'none' },
            info: {
              displayName: '',
            },
          },
          session: {
            personaTypes: { types: ['admin'] },
          },
        },
      })
    },
    '* some': async _message => {
      return { items: [] }
    },
  },
}

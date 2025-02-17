import { email_address_schema } from '@moodle/lib-types'
import { left, right } from 'fp-ts/Either'
import { some } from 'fp-ts/Option'
import { NO_JOB_HERE } from '../moo/lib/constants'

const _1: moo.model.impl<moo.Models['userAccount']> = {
  user: {
    '#': _id => ({
      email: NO_JOB_HERE,
      session: NO_JOB_HERE,
      password: NO_JOB_HERE,
      profile: {
        info: {
          '* replace': async ({ newData: _newData, conditions: _conditions }) => {
            return right('done')
          },
          '& replace': async (_outcme, _message) => {
            return
          },
        },
        background: NO_JOB_HERE,
        avatar: {
          '* fromTempFile': async ({ tempId: _tempId }) => {
            return left({ message: 'NOT_FOUND' })
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

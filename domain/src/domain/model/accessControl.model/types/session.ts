import { signed_token } from '@moodle/lib-types'

export type activeAuthSessionInfo = moo.session.info & { authSessionToken: signed_token }

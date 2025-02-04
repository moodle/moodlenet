/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as moo from 'moodle-domain'

export type getMine = moo.DefUseCaseEndpoint<[void, { userAccess: moo.UserAccess }, undefined]>

import { intersection } from '@moodle/lib-types'
import env from './modules/env'
import iam from './modules/iam'
import net from './modules/net'
import netWebappNextjs from './modules/net-webapp-nextjs'
import org from './modules/org'
import storage from './modules/storage'
import userHome from './modules/user-home'
import crypto from './modules/crypto'

export type MoodleDomain = intersection<[{ version: '5.0' }, env, iam, net, netWebappNextjs, org, storage, userHome, crypto]>
export type moodlePrimary = MoodleDomain['primary']
export type moodleModuleName = keyof moodlePrimary & keyof moodleSecondary
export type moodleSecondary = MoodleDomain['secondary']
export type moodleEvent = MoodleDomain['event']

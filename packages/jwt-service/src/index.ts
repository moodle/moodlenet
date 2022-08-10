import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { jswParse, signupToken } from './token.service'

export type JwtServiceExt = ExtDef<
  '@moodlenet/jwt-service',
  '0.1.0',
  void,
  {
    signupToken: SubTopo<{ user: any }, { jwt: string }>
    verifyToken: SubTopo<{ token: string }, { decode: any }>
  }
>

const ext: Ext<JwtServiceExt, [CoreExt, ReactAppExt]> = {
  name: '@moodlenet/jwt-service',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0'],
  connect(shell) {
    const [, reactApp] = shell.deps

    return {
      deploy() {
        // business logic, wire-up to the message system,
        // other packages integration
        //   listen to messages -> send other messages
        //    use other packages plugins (e.g add UI to react app, or add http-endpoint)
        console.log('I am jwt extension')
        reactApp.plug.setup({
          routes: {
            moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
            // rootPath: 'm', // http://localhost:3000/my-test
          },
        })

        shell.expose({
          // http://localhost:8080/_/_/raw-sub/@moodlenet/jwt-service/0.1.0/_test  body:{"paramIn2": "33"}
          'signupToken/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
          'verifyToken/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
        })
        // code that allocate system resouces ( DB connections, listen to ports )
        // implement package's service messages

        shell.provide.services({
          async signupToken({ user }) {

            const token = signupToken(user)
            return {jwt:token}
          },
          async verifyToken({ token }) {
            return jswParse(token)
          },
        })
        return {}
      },
    }
  },
}

export default ext

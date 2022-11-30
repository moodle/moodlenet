import { connectPkg, defApi, pkgConnection } from '@moodlenet/core'
import reactAppPkgRef from '@moodlenet/react-app'

const myPkgConnection = await connectPkg(import.meta, {
  apis: {
    helloWorldApi: defApi(
      ctx => async (stringParam, numberParam) => {
        return {
          msg: `Hello world`,
          stringParam,
          numberParam,
          callerPackage: ctx.caller.pkgId,
        }
      },
      (stringParam, numberParam) => {
        const valid = typeof stringParam === 'string' && typeof numberParam === 'number'
        return {
          valid,
          msg: valid ? undefined : 'bad params',
        }
      },
    ),
  },
})

export const reactAppPkg = await pkgConnection(import.meta, reactAppPkgRef)

reactAppPkg.api('plugin')({
  mainComponentLoc: ['src', 'webapp', 'MainComponent.jsx'],
  usesPkgs: [myPkgConnection],
})

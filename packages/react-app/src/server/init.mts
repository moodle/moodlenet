import { instanceDomain } from '@moodlenet/core'
import { mountApp } from '@moodlenet/http-server/server'
import kvStoreFactory from '@moodlenet/key-value-store/server'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { defaultAppearanceData } from '../common/exports.mjs'
import type { MyWebAppDeps } from '../common/my-webapp/types.mjs'
import { expose as myExpose } from './expose.mjs'
import { plugin } from './lib.mjs'
import type { OpenGraphData, OpenGraphDataProvided } from './opengraph.mjs'
import { getDefaultOpenGraphData, OpenGraphProviderItems } from './opengraph.mjs'
import { shell } from './shell.mjs'
import type { KeyValueData } from './types.mjs'

import { latestBuildFolder } from './webpack/generated-files.mjs'

export const env = getEnv()

export const kvStore = await kvStoreFactory<KeyValueData>(shell)
if (!(await kvStore.get('appearanceData', '')).value) {
  await kvStore.set('appearanceData', '', defaultAppearanceData)
}
if (!(await kvStore.get('configs', '')).value) {
  await kvStore.set('configs', '', {
    webIconSize: [256, 256],
    webImageSize: [1000, 1000],
  })
}

await shell.call(plugin)<MyWebAppDeps>({
  mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
  deps: {
    me: myExpose,
  },
})

export const httpApp = await shell.call(mountApp)({
  getApp(express) {
    if (env.noWebappServer) {
      return
    }
    const mountApp = express()
    const staticWebApp = express.static(latestBuildFolder, { index: false })
    mountApp.use(staticWebApp)
    //cookieParser(secret?: string | string[] | undefined, options?: cookieParser.CookieParseOptions | undefined)
    mountApp.get(`*`, async (req, res, next) => {
      if (req.url.startsWith('/.') || /\.\w*$/gi.test(req.url)) {
        next()
        return
      }

      const webappPath = req.url
      let openGraphDataProvided: OpenGraphDataProvided | undefined
      for (const providerItem of OpenGraphProviderItems) {
        openGraphDataProvided = await providerItem.provider(webappPath)
        if (openGraphDataProvided) {
          break
        }
      }
      const openGraphData: OpenGraphData = {
        url: `${instanceDomain}${req.url}`,
        type: 'website',
        //FIXME: need to add image to orgData !
        image: 'https://moodle.net/moodlenet-logo.svg',
        ...(await getDefaultOpenGraphData()),
        ...openGraphDataProvided,
      }

      console.log({ webappPath, openGraphDataProvided, openGraphData })

      const _html = await readFile(resolve(latestBuildFolder, 'index.html'), 'utf-8')
      const headReplace = openGraphData
        ? `<head>
<title>${openGraphData.title}</title>
<meta name="description" content="${openGraphData.description}" />
<!-- OpenGraph -->
<meta property="og:title" content="${openGraphData.title}" />
<meta property="og:description" content="${openGraphData.description}" />
<meta property="og:image" content="${openGraphData.image}" />
<meta property="og:url" content="${openGraphData.url}">
<meta property="og:type" content="${openGraphData.type}">
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="${instanceDomain.split('//')[1]}">
<meta property="twitter:url" content="${openGraphData.url}">
<meta name="twitter:title" content="${openGraphData.title}">
<meta name="twitter:description" content="${openGraphData.description}">
<meta name="twitter:image" content="${openGraphData.image}">
`
        : `<head>
<title>MoodleNet</title>
`
      const html = _html.replace('<head>', headReplace.replace(/\n/g, ''))

      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.send(html)
    })
    return mountApp
  },
  mountOnAbsPath: '/',
})

type Env = {
  noWebappServer: boolean
}
function getEnv(): Env {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = {
    noWebappServer: false,
    ...config,
  }

  return env
}

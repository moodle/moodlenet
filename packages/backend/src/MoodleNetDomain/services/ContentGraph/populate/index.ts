require('../../../../../dotenv')
import { getDB } from '../persistence/impl/arango/ContentGraph.persistence.arango.env'
import { getGraph } from '../persistence/impl/arango/setupGraph'
import { populate } from './populate'

const allowed_env = ['development', 'test']
if (!allowed_env.includes(process.env.NODE_ENV!)) {
  console.error(`
  env var NODE_ENV is not set explicitelly to ${allowed_env.join(' | ')} 
  it is set to ${process.env.NODE_ENV} instead
  Don't dare to mess !`)
  process.exit()
}
getDB().then(async db => {
  const graph = await getGraph({ db })
  console.log('dropping graph')
  await graph.drop(true)
  console.log('setup graph')
  await getGraph({ db })
  console.log('populate')
  populate()
})

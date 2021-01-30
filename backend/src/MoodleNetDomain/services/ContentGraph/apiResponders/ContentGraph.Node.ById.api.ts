import { MoodleNet } from '../../..'
import { NodeByIdApiHandler } from '../apis/ContentGraph.Node.ById'
MoodleNet.api('ContentGraph.Node.ById').respond(NodeByIdApiHandler)

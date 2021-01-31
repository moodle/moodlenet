import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { NodeByIdApiHandler } from '../apis/ContentGraph.Node.ById'
api<MoodleNetDomain>()('ContentGraph.Node.ById').respond(NodeByIdApiHandler)

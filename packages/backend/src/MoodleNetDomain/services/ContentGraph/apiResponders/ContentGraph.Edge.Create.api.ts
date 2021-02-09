import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { CreateEdgeHandler } from '../apis/ContentGraph.Edge.Create'
api<MoodleNetDomain>()('ContentGraph.Edge.Create').respond(CreateEdgeHandler)

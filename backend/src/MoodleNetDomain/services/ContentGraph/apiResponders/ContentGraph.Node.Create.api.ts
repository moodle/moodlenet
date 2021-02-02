import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { CreateNodeHandler } from '../apis/ContentGraph.Node.Create'
api<MoodleNetDomain>()('ContentGraph.Node.Create').respond(CreateNodeHandler)

import { AsyncPort, ExtensionDef } from '@moodlenet/kernel/lib'
import { CreateNodePayload, GlyphData, GlyphType, Node } from './glyphs'

export type ContentGraph = ExtensionDef<
  'content-graph.moodle.net',
  '1.3',
  {
    createNode: AsyncPort<
      <Type extends GlyphType = GlyphType, Data extends GlyphData = GlyphData>(
        node: CreateNodePayload<Type, Data>,
      ) => Promise<{ newNode: Node<Type, Data> }>
    >
  }
>

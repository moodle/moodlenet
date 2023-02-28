# MoodleNet Key value store

This package manages system's all installed authentication strategies

Glyphs : definezione !!! arango, collezioni, 2 tipi di collezioni, nodi , e edge, e.> dge crea relazioni tra nodi (definite tipo json), glyphs = struttura dei dati che può essere nodo o edge

node -> contengono le entità (oggetti di bussines) edge -> rappresentano un collegamento tra due nodi e possono avere altri dati come metadati a quella relazione esempio utente likes ---> altre entità

ho 3 collezioni utente nodo, likes è un edge ,

### API

getMyUserNode node : read, create, edit ensureGlyphs

ensureGlyphs fullGlyphName = getCollectionName(pkgId, pkgGlyphName) Defs[collectionName]['kind'], Defs[collectionName]['type']

    const opts: CollectionDefOpt = {
      kind: glyphOpts.kind,
      opts: glyphOpts.opts,
    }

return { descriptor, opts, pkgGlyphName, fullGlyphName }

CollectionDefOptMap : lista delle collezioni dei packages, i package di norma inseriscono le collezioni in un unico db access-control e possibile che un package si crea un db / collezione suo db

access control crea db , e permette di creare collezione

il db mette in relazione tutte le collezione, (attenzione alle collezioni di graph, dove i package mettono le entità condivise tra i package)

export type GlyphDefsMap<Defs extends Record<string, GlyphDef> = Record<string, GlyphDef>> = Defs

    collectionsDefOptMap = { ..._coll_def_opt_map, [glyphName]: opts }  {} as CollectionDefOptMap,
     await arangoPkg.api('ensureCollections')({ defs: collectionsDefOptMap })

### lib:

     createNode
     editNode
     createEdge
     readNode

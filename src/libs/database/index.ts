import { connect, Database, Collection } from 'json-file-database'
import { Library, LibraryModel } from './library'
import { Media, MediaModel } from './media'

let db: Database
let Libraries: Collection<Library, number>
let Medias: Collection<Media, number>

export default function init(dir: string) {
  db = connect({
    file: `${ dir }/db.json`,
    init: {
      libraries: [],
      medias: []
    },
  })

  // Setup Libraries
  Libraries = db('libraries')
  const allLibs = Libraries.findAll(() => true)

  if(allLibs.length) {
    LibraryModel.count = allLibs[allLibs.length - 1].id
  }

  LibraryModel.db = Libraries
  // ***************

  // Setup Medias
  Medias = db('medias')
  const allMedias = Medias.findAll(() => true)

  if(allMedias.length) {
    MediaModel.count = allMedias[allMedias.length - 1].id
  }

  MediaModel.db = Medias
  // ***************
}

export {
  Libraries
}

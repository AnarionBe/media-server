import { connect, Database, Collection } from 'json-file-database'
import { Library, LibraryModel } from './library'

let db: Database
let Libraries: Collection<Library, number>

export default function init(dir: string) {
  db = connect({
    file: `${ dir }/db.json`,
    init: {
      libraries: []
    },
  })

  Libraries = db('libraries')
  const allLibs = Libraries.findAll(() => true)

  if(allLibs.length) {
    LibraryModel.count = allLibs[allLibs.length - 1].id
  }
  LibraryModel.db = Libraries
}

export {
  Libraries
}
import { DirentDescription, scanFolder } from '../../helpers/fs'
import type { Collection } from 'json-file-database'

export type Library = {
  id: number
  name: string
  folders: Array<string>
  mediaType: string
  content: Array<DirentDescription>
}

export class LibraryModel {
  private _id: number | null
  private _name: string
  private _folders: Array<string>
  private _mediaType: string
  private _content: Array<DirentDescription>

  public static db: Collection<Library, number>
  public static count: number = 1

  constructor(lib: {
    id?: number,
    name: string,
    paths: Array<string>,
    mediaType: string
  }) {
    this._id = lib.id ?? null
    this._name = lib.name
    this._folders = lib.paths
    this._mediaType = lib.mediaType
    this._content = []
  }

  public async scanFolders() {
    try {
      const proms = this._folders.map(f => scanFolder(f, true))
      this._content = (await Promise.all(proms)).flat()

      return this._content
    } catch(e) {
      console.log(e)
    }
  }

  public save() {
    if(this._id) {
      LibraryModel.db.update(this._id, this.convert())
      return
    }

    LibraryModel.count++
    LibraryModel.db.insert({ id: LibraryModel.count, ...this.convert() })
  }

  private convert() {
    return {
      name: this._name,
      folders: this._folders,
      mediaType: this._mediaType,
      content: this._content
    }
  }
}

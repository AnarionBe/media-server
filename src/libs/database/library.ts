import { DirentDescription, scanFolder } from '../../helpers/fs'
import type { Collection } from 'json-file-database'

export type Library = {
  id: number
  name: string | null
  folders: Array<string>
  mediaType: string
  content: Array<DirentDescription>
}

export type LibraryParams = {
  id?: number,
  name?: string,
  paths: Array<string>,
  mediaType: string
}

export class LibraryModel {
  private _id: number | null
  private _name: string | null
  private _folders: Array<string>
  private _mediaType: string
  private _content: Array<DirentDescription>

  public static db: Collection<Library, number>
  public static count: number = 0

  constructor(lib: LibraryParams) {
    this._id = lib.id ?? null
    this._name = lib.name ?? null
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

  public async load() {
    if(!this._id) throw(`No library found with id ${ this._id }`)

    const val = LibraryModel.db.find(this._id)

    if(!val) throw(`No library found with id ${ this._id }`)

    this.parse(val)
  }

  public update(data: LibraryParams) {
    this._name = data.name ?? this._name
    this._folders = data.paths ?? this._folders
    this._mediaType = data.mediaType ?? this._mediaType

    return
  }

  public addFolders(folders: Array<string>) {
    this._folders = this._folders.concat(folders)
    return
  }

  private convert() {
    return {
      name: this._name,
      folders: this._folders,
      mediaType: this._mediaType,
      content: this._content
    }
  }

  private parse(lib: Library) {
    this._id = lib.id
    this._name = lib.name
    this._folders = lib.folders
    this._mediaType = lib.mediaType
    this._content = lib.content
  }

  public get json() {
    return {
      id: this._id,
      name: this._name,
      folders: this._folders,
      mediaType: this._mediaType,
      content: this._content
    }
  }
}

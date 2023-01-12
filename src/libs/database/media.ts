import type { Collection } from 'json-file-database'

export type Media = {
  id: number
  filename: string
  path: string
  type: string
  metadata: object | null
}

export type MediaParams = {
  id?: number
  filename: string
  path: string
  type: string
  metadata?: object
}

export class MediaModel {
  private _id: number | null
  private _filename: string
  private _path: string
  private _type: string
  private _metadata: object | null

  public static db: Collection<Media, number>
  public static count: number = 0

  constructor(media: MediaParams) {
    this._id = media.id ?? null
    this._filename = media.filename
    this._path = media.path
    this._type = media.type
    this._metadata = media.metadata ?? null
  }

  public save() {
    if(this._id) {
      MediaModel.db.update(this._id, this.convert())
      return
    }

    MediaModel.count++
    MediaModel.db.insert({ id: MediaModel.count, ...this.convert() })
  }

  private convert() {
    return {
      filename: this._filename,
      path: this._path,
      type: this._type,
      metadata: this._metadata
    }
  }
}

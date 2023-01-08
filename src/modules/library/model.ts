import { scanFolder, DirentDescription } from '../../helpers/fs';

export class Library {
  private _name: string 
  private _folders: Array<string>
  private _mediaType: string
  private _content: Array<DirentDescription>

  private static id = 0

  constructor(lib: {
    name: string,
    paths: Array<string>,
    mediaType: string
  }) {
    Library.id++

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

  private save() {
    // db.
  }
}
import { promises as fsp } from 'fs'

export const DIRENT_TYPES = {
  FILE: 'file',
  DIRECTORY: 'directory',
} as const

export type DirentDescription = {
  path: string,
  name: string,
  type: string,
  content: Array<DirentDescription> | null
}

const filters = /^(.*\.(mp4|avi|mkv)$)?[^.]*$/i

export async function scanFolder(path: string, recursive = false): Promise<DirentDescription[]> {
  try {
    const dir = await fsp.opendir(path)
    const content = []

    for await (const entry of dir) {
      if(entry.name[0] === '.' || (!entry.isDirectory() && !entry.name.match(filters))) continue

      content.push({
        path: `${path}/${entry.name}`,
        name: entry.name,
        type: entry.isDirectory()
          ? DIRENT_TYPES.DIRECTORY
          : DIRENT_TYPES.FILE,
        content: recursive && entry.isDirectory()
          ? await scanFolder(`${path}/${entry.name}`, recursive)
          : null
      })
    }

    return content
  } catch(e) {
    throw(`Error scannning folder ${ path }: ${ e }\n`)
  }
}
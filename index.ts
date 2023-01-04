import express from 'express'
import fs from 'fs'

const app = express()

const CHUNK_SIZE = 10 ** 6

app.get('/', (req, res) => {
  res.sendFile(`${ __dirname }/index.html`)
})

// Start streaming
app.get('/video', (req, res) => {
  const path = 'test.mp4'
  const stream = fs.createReadStream(path)

  stream.pipe(res)
})

// Scan dir
app.get('/dir', async (req, res) => {
  let dir = await fs.promises.opendir('./')
  
  for await (const dirent of dir) {
    console.log(dirent.name)
  }

})

app.listen(3000)
import express from 'express'
import fs from 'fs'
import bodyParser from 'body-parser'
import router from './src/router'

import initDb from './src/libs/database'

const app = express()
initDb(__dirname)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

router.initApi(app)

app.get('/', (req, res) => {
  res.sendFile(`${ __dirname }/index.html`)
})

// Start streaming
app.get('/video', (req, res) => {
  const path = `${ __dirname }/test.mp4`
  const stream = fs.createReadStream(path)

  stream.pipe(res)
})

// Scan dir
app.get('/dir', async (req, res) => {
  let dir = await fs.promises.opendir('./')
  let result = []

  for await (const entry of dir) {
    result.push(entry)
    console.log(Object.keys(entry))
  }

  res.status(200).send(result)
})

app.listen(3000)
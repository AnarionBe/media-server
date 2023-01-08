import type { Express } from 'express'
import libraryRouter from './modules/library'

function initApi(app: Express) {
  app.use('/api/library', libraryRouter)
}

export default {
  initApi
}
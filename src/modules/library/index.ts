import { Router } from 'express'
import { LibraryModel } from '../../libs/database/library'

const router = Router()

router.post('/create', async (req, res) => {
  const lib = new LibraryModel(req.body)

  const result = await lib.scanFolders()

  lib.save()

  res.status(201).json(result)
})

export default router
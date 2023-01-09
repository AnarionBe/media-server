import { Router } from 'express'
import { LibraryModel } from '../../libs/database/library'

const router = Router()

router.post('/create', async (req, res) => {
  const lib = new LibraryModel(req.body)
  const result = await lib.scanFolders()
  lib.save()

  res.status(201).json(result)
})

router.put('/update/:id', async (req, res) => {
  try {
    const lib = new LibraryModel({ id: parseInt(req.params.id) })

    await lib.update(req.body)
    await lib.scanFolders()
    lib.save()

    res.status(200).json(lib)
  } catch(e) {
    console.log(e)
    res.status(404).send({ error: e })
  }
})

export default router

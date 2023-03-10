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

    await lib.load()
    lib.update(req.body)
    await lib.scanFolders()
    lib.save()

    res.status(200).json(lib)
  } catch(e) {
    console.log(e)
    res.status(404).send({ error: e })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const lib = new LibraryModel({ id: parseInt(req.params.id) })

    await lib.load()

    return res.status(200).json(lib.json)
  } catch(e) {
    console.log(e)
    res.status(404).send({ error: e })
  }
})

router.put('/update/:id/add-folders', async (req, res) => {
  try {
    const lib = new LibraryModel({ id: parseInt(req.params.id) })

    await lib.load()
    lib.addFolders(req.body.folders)
    await lib.scanFolders()
    lib.save()

    res.status(200).json(lib)
  } catch(e) {
    console.log(e)
    res.status(404).send({ error: e })
  }
})

export default router

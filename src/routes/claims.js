const { Router } = require('express')
const prisma = require('../prisma')
const auth = require('../middleware/auth')

const router = Router()

router.use(auth)

router.get('/', async (req, res) => {
  try {
    const claims = await prisma.claim.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(claims)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch claims' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const claim = await prisma.claim.findUnique({ where: { id: Number(req.params.id) } })
    if (!claim) return res.status(404).json({ error: 'Claim not found' })
    res.json(claim)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch claim' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body
    if (!title || !description) return res.status(400).json({ error: 'title and description are required' })
    const claim = await prisma.claim.create({
      data: { title, description, ...(status && { status }), userId: req.user.userId }
    })
    res.status(201).json(claim)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create claim' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body
    const claim = await prisma.claim.update({
      where: { id: Number(req.params.id) },
      data: { ...(title && { title }), ...(description && { description }), ...(status && { status }) }
    })
    res.json(claim)
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Claim not found' })
    res.status(500).json({ error: 'Failed to update claim' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await prisma.claim.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Claim not found' })
    res.status(500).json({ error: 'Failed to delete claim' })
  }
})

module.exports = router

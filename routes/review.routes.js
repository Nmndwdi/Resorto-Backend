import { Router } from 'express'
import { reviewInitiate, reviewVerify, approvedReviews } from '../controllers/reivew.controller.js'

const router = Router()

router.post('/review-initiate', reviewInitiate)
router.post('/review-verify', reviewVerify)
router.get('/approved-reviews', approvedReviews)

export default router

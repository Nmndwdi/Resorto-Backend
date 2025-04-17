import { Router } from 'express'
import { unapprovedReviews, approveReview, deleteReview } from '../controllers/reivew.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/unapproved-reviews', verifyJWT, unapprovedReviews)
router.post('/approve-review', verifyJWT, approveReview)
router.post('/delete-review', verifyJWT, deleteReview)

export default router

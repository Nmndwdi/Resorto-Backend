import {Router} from "express"
import { updateInfo, updateLogo, addInHomeImages,removeFromHomeImages,addEventOption,removeEventOption,updateEventOption,updateInHomeImages,addMainInfo,removeMainInfo,updateMainInfo,addGallery,removeGallery,updateGalleryTitle,addInGallery,removeFromGallery,updateInGallery } from "../controllers/info.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router=Router()

router.route("/update-info").post(verifyJWT,updateInfo)
router.route("/update-logo").post(verifyJWT,upload.single("logo"),
updateLogo)
router.route("/add-in-home-images").post(verifyJWT,upload.array("home_images"),addInHomeImages)
router.route("/update-in-home-images").post(verifyJWT,upload.single("image"),updateInHomeImages)
router.route("/remove-from-home-images").post(verifyJWT,removeFromHomeImages)
router.route("/add-event-option").post(verifyJWT,addEventOption)
router.route("/remove-event-option").post(verifyJWT,removeEventOption)
router.route("/update-event-option").post(verifyJWT,updateEventOption)
router.route("/add-main-info").post(verifyJWT,addMainInfo)
router.route("/remove-main-info").post(verifyJWT,removeMainInfo)
router.route("/update-main-info").post(verifyJWT,updateMainInfo)
router.route("/add-gallery").post(verifyJWT,upload.array("images"),addGallery)
router.route("/remove-gallery").post(verifyJWT,removeGallery)
router.route("/update-gallery-title").post(verifyJWT,updateGalleryTitle)
router.route("/add-in-gallery").post(verifyJWT,upload.array("images"),addInGallery)
router.route("/remove-from-gallery").post(verifyJWT,removeFromGallery)
router.route("/update-in-gallery").post(verifyJWT,upload.single("image"),updateInGallery)

export default router
import {Router} from "express"
import { getHeaderInfo,getFooterInfo,getHomeInfo,getAboutInfo,getContactInfo,getPricingInfo,getGalleryInfo, getAdminData } from "../controllers/infoRetrieving.controller.js"

const router=Router()

router.route("/header-info").get(getHeaderInfo)
router.route("/footer-info").get(getFooterInfo)
router.route("/home-info").get(getHomeInfo)
router.route("/about-info").get(getAboutInfo)
router.route("/contact-info").get(getContactInfo)
router.route("/pricing-info").get(getPricingInfo)
router.route("/gallery-info").get(getGalleryInfo)
router.route("/admin-data").get(getAdminData)

export default router
var express = require('express')
var router = express.Router()
var controllerLocations = require('../controllers/locations')
var controllerOthers = require('../controllers/others')

/* Locations pages */
router.get('/', controllerLocations.homelist)
router.get('/location/:locationId', controllerLocations.locationInfo)
router.get('/location/:locationId/reviews/new', controllerLocations.addReview)
router.post('/location/:locationId/reviews/new', controllerLocations.doAddReview)

/* Other pages */
router.get('/about', controllerOthers.about)

module.exports = router

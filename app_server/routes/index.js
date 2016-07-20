var express = require('express')
var router = express.Router()
var controllerLocations = require('../controllers/locations')
var controllerOthers = require('../controllers/others')

/* Locations pages */
router.get('/', controllerLocations.homelist)
router.get('/location/:locationId', controllerLocations.locationInfo)
router.get('/location/review/new', controllerLocations.addReview)

/* Other pages */
router.get('/about', controllerOthers.about)

module.exports = router

var express = require('express')
var router = express.Router()
var locationsController = require('../controllers/locations')
var reviewsController = require('../controllers/reviews')
var authController = require('../controllers/authentication')
var jwt = require('express-jwt')
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
})

// locations routes
router.get('/locations', locationsController.locationsListByDistance)
router.post('/locations', locationsController.locationsCreate)
router.get('/locations/:locationId', locationsController.locationsReadOne)
router.put('/locations/:locationId', locationsController.locationsUpdateOne)
router.delete('/locations/:locationId', locationsController.locationsDeleteOne)

// reviews routes
router.post('/locations/:locationId/reviews', auth, reviewsController.reviewsCreate)
router.get('/locations/:locationId/reviews/:reviewId', reviewsController.reviewsReadOne)
router.put('/locations/:locationId/reviews/:reviewId', auth, reviewsController.reviewsUpdateOne)
router.delete('/locations/:locationId/reviews/:reviewId', auth, reviewsController.reviewsDelete)

// auth
router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router

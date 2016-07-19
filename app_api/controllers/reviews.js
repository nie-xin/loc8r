var mongoose = require('mongoose')
var Loc = mongoose.model('Location')

var sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

var doSetAverageRating = function (location) {
  var i = null
  var reviewCount = 0
  var ratingAverage = 0
  var ratingTotal = 0

  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length
    ratingTotal = 0
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10)
    location.rating = ratingAverage
    location.save(function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('Average rating updated  to ', ratingAverage)
      }
    })
  }
}

var updateAverageRating = function (locationId) {
  Loc
    .findById(locationId)
    .select('rating reviews')
    .exec(function (err, location) {
      if (!err) {
        doSetAverageRating(location)
      }
    })
}

var doAddReview = function (req, res, location) {
  if (!location) {
    sendJsonResponse(res, 404, { message: 'locationId not found' })
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    })

    location.save(function (err, location) {
      var thisReview = null
      if (err) {
        sendJsonResponse(res, 400, err)
      } else {
        updateAverageRating(location._id)
        thisReview = location.reviews[location.reviews.length - 1]
        sendJsonResponse(res, 201, thisReview)
      }
    })
  }
}
module.exports.reviewsCreate = function (req, res) {
  var locationId = req.params.locationId
  if (locationId) {
    Loc
      .findById(locationId)
      .select('reviews')
      .exec(function (err, location) {
        if (err) {
          sendJsonResponse(res, 400, err)
        } else {
          doAddReview(req, res, location)
        }
      })
  } else {
    sendJsonResponse(res, 404, { message: 'Not found, locationId required' })
  }
}

module.exports.reviewsReadOne = function (req, res) {
  if (req.params && req.params.locationId && req.params.reviewId) {
    Loc
      .findById(req.params.locationId)
      .select('name reviews')
      .exec(function (err, location) {
        console.log(location)
        var response = null
        var review = null

        if (!location) {
          sendJsonResponse(res, 404, { message: 'locationId not fond' })
          return
        } else if (err) {
          sendJsonResponse(res, 404, err)
          return
        }

        if (location.reviews && location.reviews.length > 0) {
          review = location.reviews.id(req.params.reviewId)
          if (!review) {
            sendJsonResponse(res, 404, { message: 'reviewId not found: ' + req.params.reviewId })
          } else {
            response = {
              location: {
                name: location.name,
                id: req.params.locationId
              },
              review: review
            }
            sendJsonResponse(res, 200, response)
          }
        } else {
          sendJsonResponse(res, 404, { message: 'No reviews found' })
        }
      })
  } else {
    sendJsonResponse(res, 404, { message: 'No locationId in request' })
  }
}

module.exports.reviewsUpdateOne = function (req, res) {}
module.exports.reviewsDelete = function (req, res) {}

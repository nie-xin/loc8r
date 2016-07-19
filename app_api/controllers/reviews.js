var mongoose = require('mongoose')
var Loc = mongoose.model('Location')

var sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

module.exports.reviewsCreate = function (req, res) {}

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
          sendJsonResponse(res, 404, { message: 'locationdId not fond' })
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

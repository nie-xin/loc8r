var mongoose = require('mongoose')
var Loc = mongoose.model('Location')

var sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

module.exports.locationsListByDistance = function (req, res) {}

module.exports.locationsCreate = function (req, res) {
  sendJsonResponse(res, 200, { status: 'success' })
}

module.exports.locationsReadOne = function (req, res) {
  Loc
    .findById(req.params.locationId)
    .exec(function (error, location) {
      if (error) {
        console.error(error)
      }
      sendJsonResponse(res, 200, { status: 'success' })
    })
}

module.exports.locationsUpdateOne = function (req, res) {}

module.exports.locationsDeleteOne = function (req, res) {}

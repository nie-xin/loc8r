var request = require('request')

var apiOptions = {
  server: 'http://localhost:3000'
}

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://xnie.herokuapp.com/'
}

var renderHomepage = function (req, res, responseBody) {
  var message = null

  if (!(responseBody instanceof Array)) {
    message = 'API lookup error'
    responseBody = []
  } else {
    if (!responseBody.length) {
      message = 'No places found nearby'
    }
  }

  res.render('location-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a point? Let Loc8r help you find the place you're looking for.",
    locations: responseBody,
    message: message
  })
}

var _formatDistance = function (distance) {
  var num = null
  var unit = null

  if (distance > 1) {
    num = parseFloat(distance).toFixed(1)
    unit = 'km'
  } else {
    num = parseInt(distance * 1000, 10)
    unit = 'm'
  }

  return num + unit
}

var renderDetailPage = function (req, res, locDetail) {
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {
      title: locDetail.name
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: locDetail
  })
}

var _showError = function (req, res, status) {
  var title = null
  var content = null

  if (status === 404) {
    title = '404, page not found'
    content = 'Oh dear. Looks like we can\'t find this page. Sorry.'
  } else {
    title = status + ', something\'s gone wrong'
    content = 'Something, somewhere, has gone just a little bit wrong.'
  }

  res.status(status)
  res.render('generic-text', {
    title: title,
    content: content
  })
}

var renderReviewForm = function (req, res, locDetail) {
  res.render('location-review-form', {
    title: 'Review ' + locDetail.name + ' on Loc8r',
    pageHeader: { title: 'Review ' + locDetail.name },
    error: req.query.err
  })
}

var getLocationInfo = function (req, res, callback) {
  var path = '/api/locations/' + req.params.locationId
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  }

  request(requestOptions, function (err, response, body) {
    if (err) {
      _showError(req, res, err)
    }

    var data = body
    if (response.statusCode === 200) {
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      }
      callback(req, res, data)
    } else {
      _showError(req, res, response.statusCode)
    }
  })
}

/* GET home page */
module.exports.homelist = function (req, res) {
  var path = '/api/locations'
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: -0.9690883,
      lat: 51.455041,
      maxDistance: 200
    }
  }

  request(requestOptions, function (err, response, body) {
    if (err) {
      console.error(err)
    }
    var data = body
    if (response.statusCode === 200 && body.length) {
      data = body.map(function (model) {
        model.distance = _formatDistance(model.distance)
        return model
      })
    }
    renderHomepage(req, res, data)
  })
}

/* GET location info page */
module.exports.locationInfo = function (req, res) {
  getLocationInfo(req, res, function (req, res, responseData) {
    renderDetailPage(req, res, responseData)
  })
}

/* GET add review page */
module.exports.addReview = function (req, res) {
  getLocationInfo(req, res, function (req, res, responseData) {
    renderReviewForm(req, res, responseData)
  })
}

module.exports.doAddReview = function (req, res) {
  var locationId = req.params.locationId
  var path = '/api/locations/' + locationId + '/reviews'
  var postData = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  }
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: postData
  }

  request(requestOptions, function (err, response, body) {
    if (err) {
      _showError(req, res, err)
    }

    if (response.statusCode === 201) {
      res.redirect('/location/' + locationId)
    } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError') {
      res.redirect('/location/' + locationId + '/reviews/new?err=val')
    } else {
      _showError(req, res, response.statusCode)
    }
  })
}

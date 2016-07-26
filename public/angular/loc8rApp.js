angular.module('loc8rApp', [])

var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

var formatDistance = function () {
  return function (distance) {
    var num = null
    var unit = null

    if (distance && _isNumeric(distance)) {
      if (distance > 1) {
        num = parseFloat(distance).toFixed(1)
        unit = 'km'
      } else {
        num = parseInt(distance * 1000, 10)
        unit = 'm'
      }

      return num + unit
    } else {
      return '?'
    }
  }
}

var locationListController = function ($scope, loc8rData, geolocation) {
  $scope.message = 'Checking your location'

  $scope.getData = function (position) {
    var lat = position.coords.latitude
    var lng = position.coords.longitude

    $scope.message = 'Searching for nearby places'

    loc8rData.locationByCoords(lat, lng)
      .success(function (data) {
        $scope.message = data.length > 0 ? '' : 'No locations found'
        $scope.data = { locations: data }
      })
      .error(function (e) {
        $scope.message = 'Sorry, something\'s gone wrong'
      })
  }

  $scope.showError = function (error) {
    $scope.$apply(function () {
      $scope.message = error.message
    })
  }

  $scope.noGeo = function () {
    $scope.$apply(function () {
      $scope.message = 'Geolocation not supported by this browser'
    })
  }

  geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo)
}

var ratingStars = function () {
  return {
    scope: {
      thisRating: '=rating'
    },
    templateUrl: '/angular/rating-stars.html'
  }
}

var loc8rData = function ($http) {
  var locationByCoords = function (lat, lng) {
    return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=200')
  }

  return {
    locationByCoords: locationByCoords
  }
}

var geolocation = function () {
  var getPosition = function (cbkSuccess, cbkError, cbkNoGeo) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(cbkSuccess, cbkError)
    } else {
      cbkNoGeo()
    }
  }

  return {
    getPosition: getPosition
  }
}

angular
  .module('loc8rApp')
  .controller('locationListController', locationListController)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars)
  .service('loc8rData', loc8rData)
  .service('geolocation', geolocation)

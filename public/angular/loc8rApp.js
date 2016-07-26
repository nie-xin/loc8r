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

var locationListController = function ($scope) {
  $scope.data = {
    locations: [{
      name: 'Burger Queen',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      distance: '0.296456',
      _id: '5370a35f2536f6785f8dfb6a'
    }, {
      name: 'Costy',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 5,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      distance: '0.7865456',
      _id: '5370a35f2536f6785f8dfb6a'
    }]
  }
}

var ratingStars = function () {
  return {
    scope: {
      thisRating: '=rating'
    },
    templateUrl: '/angular/rating-stars.html'
  }
}

angular
  .module('loc8rApp')
  .controller('locationListController', locationListController)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars)

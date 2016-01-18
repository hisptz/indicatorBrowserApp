'use strict';

/* Filters */

var indicatorsFilters = angular.module('indicatorsFilters', [])
    .filter('replaceSemiColonWithComma',function() {
        return function(textToReplace) {
            var replacedText = textToReplace.replace(/\;/g,', ');
            return replacedText;
        }
    })
    .filter('toFixed',function(){
        return function(textToApproximate,precision){
            var approximatedFilter = textToApproximate.toFixed(precision);
            return approximatedFilter;
        }
    })
   .filter('offset', function() {
        return function(input, start) {
            start = parseInt(start);
            return input.slice(start);
        };
    })
 .filter("range", function ($filter) {
    return function (data, page, size) {
        if (angular.isArray(data) && angular.isNumber(page) && angular.isNumber(size)) {
            var start_index = (page - 1) * size;
            if (data.length < start_index) {
                return [];
            } else {
                return $filter                                                                                                                                                                                                                                                                                                                                                                                                                                                  ("limitTo")(data.splice(start_index), size);
            }
        } else {
            return data;
        }
    }
   })
    .filter("pageCount", function () {
        return function (data, size) {
            if (angular.isArray(data)) {
                var result = [];
                for (var i = 0; i < Math.ceil(data.length / size) ; i++) {
                    result.push(i);
                }
                return result;
            } else {
                return data;
            }
        }
    });
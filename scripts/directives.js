'use strict';

/* Directives */

var indicatorsDirectives = angular.module('indicatorsDirectives', []);
indicatorsDirectives.directive("indicatorDetail",function(){
     return {
         restrict:"EA",
         templateUrl:"views/indicatorDetail.html",
         replace:true,
         transclude:true,
         compile: function(element, attrs) {
             return {
                 pre: function preLinkFn(scope, element, attrs) {
                     //if executed here collapsable only is called on an empty <ul>
                 },
                 post: function postLinkFn(scope, element, attrs) {
                     function linkFn(scope, element, attributes) {
                         debugger;
                         $('.collapsible').collapsible({accordion: true});
                     }
                 }
             }
         }
       }
});



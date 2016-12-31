
'use strict';

/* App Module */

var indicators = angular.module('indicators',
                    ['ui.bootstrap',
                     'ngRoute', 'ui.date',
                     'ngCookies',
                     'ngSanitize',
                     'indicatorsDirectives',
                     'indicatorsControllers',
                     'indicatorsServices',
                     'indicatorsFilters',
                     'd2Services',
                     'd2Controllers',
                     'pascalprecht.translate',
                     'd2HeaderBar',
                     'ngAnimate',
                     'angularUtils.directives.dirPagination','angular-loading-bar','mgcrea.ngStrap'])
              
.value('DHIS2URL', '../../..')
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
            //cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading indicators please wait...</span></div>';
}])
.config(function($translateProvider,$routeProvider) {

	$routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    }).otherwise({
        redirectTo : '/'
    });
     
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});

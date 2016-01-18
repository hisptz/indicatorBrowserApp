
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
                     'ngAnimate'])
              
.value('DHIS2URL', '../../..')
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

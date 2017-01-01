var mainServices = angular.module('mainServices',['ngResource'])
    .value('DHIS2URL', '../../..');

mainServices.factory('indicatorGroupList',function($http,DHIS2URL,$q){
    return {
        listIndicatorGroup:function(indicatorUid){
            var defer = $q.defer();
            var response=$http.get(DHIS2URL+'/api/indicatorGroups/'+indicatorUid+'.json?fields=indicators[id,name,href,shortName,displayName,denominatorDescription,numeratorDescription,denominator,numerator,indicatorType[name]]').then(function (indicatorObject) {
                return indicatorObject.data

            })
            return response;


        },

    }

});


mainServices.factory('reportService', function ($q) {
    var reportService = {
        getMonths: function (startDateObj, endDateObj) {
            var startDate = moment(startDateObj);
            var endDate = moment(endDateObj).endOf("month");

            var allMonthsInPeriod = [];

            while (startDate.isBefore(endDate)) {
                allMonthsInPeriod.push(startDate.format("YYYYMM"));
                startDate = startDate.add(1, "month");
            }
            return allMonthsInPeriod;
        }
    };

    return reportService;
});

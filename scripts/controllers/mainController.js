var mainController  = angular.module('mainController',['datatables','ngResource','highcharts-ng'])
.constant('indicatorUrl','../../../api/indicators.json?fields=id,name,href,shortName,displayName,denominatorDescription,numeratorDescription,denominator,numerator,indicatorType[name],indicatorGroups[name]&paging=false')
.constant("indicatorGroupUrl", "../../../api/indicatorGroups.json?paging=false&fields=id,name,href");
mainController.controller('MainController',['$scope','$timeout','$window',
        '$http','$filter','$resource','indicatorUrl','indicatorGroupUrl','DTOptionsBuilder','DTColumnDefBuilder',
        function($scope,$timeout,$window,$http,$filter,$resource,
                 indicatorUrl,indicatorGroupUrl,
                 DTOptionsBuilder, DTColumnDefBuilder){
            var selectedIndicators = null;
            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDisplayLength(50)
                .withOption('scrollY', '70vh');
            $scope.numeratorArray=[];
            $scope.loading = false;
            $scope.loadingHelp = false;
            $scope.sectionhide = false;
            $scope.loader = true;
            $scope.divPan = "col s7 offset-s1";
            $scope.class = "col s12";
            $scope.classTohide = " ";
            $scope.initialization=function() {
            $http.get(indicatorUrl).success(function (indicatorsObject) {
                $timeout(function () {
                    $scope.loader = false;
                    $scope.indicatorData = indicatorsObject;
                    $scope.loadingHelp = true;
                    $scope.loading = true;
                    console.log(indicatorsObject);
                }, 2000);
            })
                .error(function (error) {
                    $scope.data.error = error;
                });


            }
            $scope.searchKeyword='';
            $scope.searchShow=false;
            $scope.groupIndicatord=function(groupName){
                $timeout(function(){
                $scope.searchKeyword=groupName;
                $scope.searchShow=true;
                console.info($scope.searchKeyword);
                },2000);
              }
            $scope.groupClose=function(){
                $timeout(function(){
                $scope.searchKeyword='';
                $scope.searchShow=false;
                },2000);
            }
            $scope.indicatordDetails=function(indicatorObject){
                $scope.numeratorArray.length=0;
                $scope.loading=true;
                $scope.numerator=false;
                $scope.loadingHelp = false;
                $scope.divPan = "col s7 offset-s1";
                $scope.sectionhide=true;
                $scope.classTohide="col s4";
                $scope.indDetail=indicatorObject;
                $scope.indicatorTrends(indicatorObject.id,indicatorObject.name);
                $scope.replacedExpression=
                        $resource('../../../api/expressions/description',{get:{method:"JSONP"}});
                    $scope.indicatorNumeratorExpression=$scope.replacedExpression.get({expression:indicatorObject.numerator},function(expData){
                        $scope.expressionData=expData;
                        console.log( expData);
                    });
                    $scope.indicatorDenominatorExpression=$scope.replacedExpression.get({expression:indicatorObject.denominator},function(expDenoData){
                        $scope.expressionDenoData=expDenoData;
                        // console.log( expDenoData);
                    });
               }
        $scope.initialization();

          //$scope.indicatorDetailResult=null;
        $scope.cardClose=function(){
          $scope.divPan="col s7 offset-s1";
          $scope.loadingHelp = true;
          $scope.sectionhide=false;
          $scope.classTohide="";
        }
        $scope.numeratorDeatail=function(numeratorUrl,numericText){
           $scope.numeratorArray.length=0;
           $scope.numerator=false;
           $scope.loadData=false;
           $scope.loaderDir=true;
          var separators = [' ', '\\\+', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?'];
           $scope.numeratorUid=numeratorUrl.split(new RegExp(separators.join('|'), 'g'));
           $scope.numericExpressionText=numericText.split('+');
           $scope.numeratorArray=[];
           angular.forEach($scope.numeratorUid,function(numUid){
                $scope.numApi=
                $resource("../../../api/expressions/description",{get:{method:"JSONP"}});
                $scope.numeratorUrlResult=$scope.numApi.get({expression:numUid},function(data){
                 $timeout(function(){
                     $scope.loaderDir=false;
                      $scope.numeratorArray.push({"description":data.description,"uid":numUid});
                     $scope.loadData=true;
                     console.log($scope.numeratorArray);
                  },2000);
               });

              });
        }
      $scope.denominatorDetail=function(denominatorUrl,denominatorText){
          $scope.numeratorDeatail(denominatorUrl,denominatorText);
      }
       $scope.numerator=false;
       $scope.dataElementDetail=function(dataElementUrl){
          $scope.dataSetDetailArray=[];
          $scope.result='';
          $scope.numerator=false;
          $scope.loaderDir=true;
          $scope.dataElementUrlReplaced=(dataElementUrl.replace(/#/g, '').replace(/{/g, '').replace(/}/g, '')).split(".")[0];
          console.info($scope.dataElementUrlReplaced);
          $scope.dataElementApi=
              $resource("../../../api/dataElements/"+$scope.dataElementUrlReplaced+".json");
              $scope.dataElementResult=$scope.dataElementApi.get(function(dataEment){
                  $timeout(function(){
                      $('.collapsible').collapsible();
                       $scope.loaderDir=false;
                       $scope.dataSetDetailArray.length=0;
                       angular.forEach(dataEment.dataSets,function(setsValue){
                           $scope.dataSetApi=
                           $resource(setsValue.href+".json",{get:{method:"JSONP"}});
                           $scope.dataSetObject=$scope.dataSetApi.get(function(dataSetValue){
                               $scope.dataSetReturned={"name":dataSetValue.name,"dataSetType":dataSetValue.periodType};
                               $scope.dataSetDetailArray.push($scope.dataSetReturned);
                               console.log($scope.dataSetDetailArray);
                            });

                          });
                       $scope.result=dataEment;
                       $scope.numerator=true;
                  },2000);
               });
      }
      $scope.allIndicatorsPrint=function(ext){
          $window.location.href='../../../api/indicators.'+ext+'?fields=id,name&paging=false';
      }
      $scope.allIndicatorsXLS=function(ext){
          $window.location.href='../../../api/indicators.'+ext+'?fields=id,name&paging=false';
      }
      $scope.allIndicatorsCSV=function(ext){
          $window.location.href='../../../api/indicators.'+ext+'?fields=id,name&paging=false';
      }
      $scope.indicatorTrends=function(indicatorUid,indicatorName){
           $scope.cards= {
               title:indicatorName,
               description:indicatorName,
               data:indicatorUid,
               dataSource:'',
               displayTable:false,
               displayMap:false,
               chart:'bar',
               chartObject:{
                   title: {
                       text: 'Bar Chart'
                   },
                   xAxis: {
                       categories: [],
                       labels:{
                           rotation: -90,
                           style:{ "color": "#000000", "fontWeight": "normal" }
                       }
                   },
                   yAxis: {
                       min: 0,
                       title: {
                           text: ''
                       },labels:{
                           style:{ "color": "#000000", "fontWeight": "bold" }
                       }
                   },
                   labels: {
                       items: [{
                           html: '',
                           style: {
                               left: '50px',
                               top: '18px',
                               color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                           }
                       }]
                   },
                   series: []
               }
   };
           $scope.me=
           $resource("../../../api/me.json");
           $scope.meUrlResult=$scope.me.get(function(meObject){
           $scope.orgUnintsAcc=meObject.dataViewOrganisationUnits;
           var orgUnits='';
            angular.forEach($scope.orgUnintsAcc,function(orgUid){
                   orgUnits+=orgUid.id+";";
             });
            $scope.concOrgUnits=orgUnits.slice(0,-1);
            console.info($scope.concOrgUnits);
            $scope.year=new Date().getFullYear()-1;
            $scope.prepareSeries($scope.cards,$scope.cards.chart);
           });
      }
    $scope.prepareData = function(jsonObject){
        var data = [];
        angular.forEach(jsonObject.metaData.ou,function(orgUnits){
            data.push({'name':jsonObject.metaData.names[orgUnits],'id':orgUnits,'value':getDataFromUrl(jsonObject.rows,orgUnits)});
        });
        console.log(data);
        return data;
    }
    $scope.prepareSeries = function(cardObject,chart){
        cardObject.chartObject.loading = true;
        $scope.url = "../../../api/analytics.json?dimension=dx:"+cardObject.data+"&dimension=ou:"+$scope.concOrgUnits+"&filter=pe:"+$scope.year+"&displayProperty=NAME";
        $http.get($scope.url).success(function(data){
            console.info(data);
            $scope.area = [];
            cardObject.chartObject.xAxis.categories = [];
            var dataToUse = $scope.prepareData(data);
            angular.forEach(dataToUse,function(val){
                cardObject.chartObject.xAxis.categories.push(val.name);
            });
            $scope.normalseries = [];
            var serie = [];
            angular.forEach(dataToUse,function(val){
                serie.push(val.value);
            });
            cardObject.chartObject.chart={};
            cardObject.chartObject.chart.type=chart;
            $scope.normalseries.push({type: chart, name: cardObject.title, data: serie});
            cardObject.chartObject.series = $scope.normalseries;
            console.log(cardObject.chartObject.series);
            cardObject.chartObject.loading = false
        });

    }
}]);
function getDataFromUrl(arr,ou) {
    var num = 0
    $.each(arr, function (k, v) {
        if (v[1] == ou) {
            num = parseInt(v[2])
        }
    });
 return num;
}

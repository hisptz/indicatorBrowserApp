var mainController  = angular.module('mainController',['ngResource','highcharts-ng'])
.constant('indicatorUrl','../../../api/indicators.json?fields=id,name,href,shortName,displayName,denominatorDescription,numeratorDescription,denominator,numerator,indicatorType[name],indicatorGroups[name,id]&paging=true')
.constant("indicatorGroupUrl", "../../../api/indicatorGroups.json?paging=false&fields=id,name,href");
mainController.controller('MainController',['$scope','$timeout','$window','$location','$q',
        '$http','$filter','$resource','$routeParams','indicatorGroupList','indicatorUrl','indicatorGroupUrl',
        function($scope,$timeout,$window,$location,$q,$http,$filter,$resource,$routeParams,indicatorGroupList,
                 indicatorUrl,indicatorGroupUrl){
            $scope.pageSize = 10;
            var selectedIndicators = null;
            $scope.numeratorArray=[];
            $scope.loading = false;
            $scope.sectionhide = false;
            $scope.loader = true;
            $scope.divPan = "col-md-10";
            $scope.class = "col-md-12";
            $scope.classTohide = " ";
            $scope.totalIndicators=0;
            $scope.initialization=function(page) {
            $http.get(indicatorUrl+"&page="+page).success(function (indicatorsObject) {
                    $scope.indicatorData = indicatorsObject;
                    $scope.totalIndicators=indicatorsObject.pager.total;
                    $scope.currentPage=indicatorsObject.pager.page;
                    $scope.loading = true;
                    console.log(indicatorsObject);
             })
                .error(function (error) {
                    $scope.data.error = error;
                });
             }
            $scope.pageChangeHandler = function(num) {
                $scope.initialization(num);
                console.log('indicator page changed to ' + num);
            }

            $scope.params=$routeParams;

            $scope.showIndGroup=false;
            $scope.groupIndicatord=function(uid,groupName){
                $scope.classTohide=" ";
                $scope.sectionhide=false;
                $scope.groupName=groupName
                $scope.divPan = "col-md-5";
                $scope.panels.activePanelind=0;
                $q.when(indicatorGroupList.listIndicatorGroup(uid)).then(function (promisedata) {
                    $scope.indicatorsObjectFromGroup=promisedata;
                    $scope.showIndGroup=true;
                    $scope.loading = true;
                    $scope.showIndGroupDetails=true;
                    $scope.indGroup="col-md-7"
                })
                $scope.searchKeyword=groupName;
                $scope.searchShow=true;
              }
            $scope.groupClose=function(){
                $timeout(function(){
                $scope.searchKeyword='';
                $scope.searchShow=false;
                },2000);
            }
            $scope.indicatordDetailGroup=function (uid,indicatorObject,index) {
                $scope.numeratorArray.length=0;
                $scope.showDetails=true;
                $scope.indDetail=indicatorObject;
                $scope.indName=indicatorObject.name;
                $scope.uid=uid;
                $scope.replacedExpression=
                    $resource('../../../api/expressions/description',{get:{method:"JSONP"}});
                $scope.indicatorNumeratorExpression=$scope.replacedExpression.get({expression:indicatorObject.numerator},function(expData){
                    $scope.expressionData=expData;
                    //console.log( expData);
                });
                $scope.indicatorDenominatorExpression=$scope.replacedExpression.get({expression:indicatorObject.denominator},function(expDenoData){
                    $scope.expressionDenoData=expDenoData;
                    // console.log( expDenoData);
                });
            }
            $scope.indicatordDetails=function(indicatorObject){

                $scope.indGroup='';
                $scope.showIndGroupDetails=false;
                $scope.numeratorArray.length=0;
                $scope.active=" ";
                $scope.loading=true;
                $scope.numerator=false;
                $scope.loadingHelp = false;
                $scope.divPan = "col-md-5";
                $scope.sectionhide=true;
                $scope.classTohide="col-md-7";
                $scope.indDetail=indicatorObject;
                $scope.indName=indicatorObject.name;
                $scope.panels.activePanel = 0;
                $scope.indicatorTrends(indicatorObject.id,indicatorObject.name);
                $scope.replacedExpression=
                        $resource('../../../api/expressions/description',{get:{method:"JSONP"}});
                    $scope.indicatorNumeratorExpression=$scope.replacedExpression.get({expression:indicatorObject.numerator},function(expData){
                        $scope.expressionData=expData;
                        //console.log( expData);
                    });
                    $scope.indicatorDenominatorExpression=$scope.replacedExpression.get({expression:indicatorObject.denominator},function(expDenoData){
                        $scope.expressionDenoData=expDenoData;
                        // console.log( expDenoData);
                    });
               }
        $scope.initialization(1);

          //$scope.indicatorDetailResult=null;
        $scope.hide=function(){
          $scope.divPan="col-md-11 col-offset-sm-1";
          $scope.loadingHelp = true;
          $scope.sectionhide=false;
          $scope.classTohide="";
          $scope.showIndGroupDetails=false;
        }
      $scope.numeratorDeatail=function(numeratorUrl,numericText){
          $scope.actives=" ";
          $scope.active="active";
          $scope.numeratorArray.length=0;
          $scope.numerator=false;
          $scope.loadData=false;
          $scope.loadData2=false;
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
          $scope.actives="active";
          $scope.active="";
          $scope.numeratorArray.length=0;
          $scope.numerator=false;
          $scope.loadData=false;
          $scope.loadData2=false;
          $scope.loaderDirs=true;
          var separators = [' ', '\\\+', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?'];
          $scope.numeratorUid=denominatorUrl.split(new RegExp(separators.join('|'), 'g'));
          $scope.numericExpressionText=denominatorText.split('+');
          $scope.numeratorArray=[];
          angular.forEach($scope.numeratorUid,function(numUid){
              $scope.numApi=
                  $resource("../../../api/expressions/description",{get:{method:"JSONP"}});
              $scope.numeratorUrlResult=$scope.numApi.get({expression:numUid},function(data){
                  $timeout(function(){
                      $scope.loaderDirs=false;
                      $scope.numeratorArray.push({"description":data.description,"uid":numUid});
                      $scope.loadData2=true;
                      console.log($scope.numeratorArray);
                  },2000);
              });

          });
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
        return data;
    }
    $scope.prepareSeries = function(cardObject,chart){
        cardObject.chartObject.loading = true;
        $scope.url = "../../../api/analytics.json?dimension=dx:"+cardObject.data+"&dimension=ou:"+$scope.concOrgUnits+"&filter=pe:"+$scope.year+"&displayProperty=NAME";
        $http.get($scope.url).success(function(data){
            //console.info(data);
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
            //console.log(cardObject.chartObject.series);
            cardObject.chartObject.loading = false
        });

    }
}]);
mainController.controller('IndicatorController',['$scope','$timeout','$window','$location',
    '$http','$filter','$resource','$routeParams','indicatorGroupList',
    function($scope,$timeout,$window,$location,$http,$filter,$resource,$routeParams,indicatorGroupList) {
             $scope.params=$routeParams;
             $scope.testservice=indicatorGroupList.listIndicatorGroup($scope.params.uid);
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

/**
 * Created by yunqing on 10/23/13.
 */

/**
 * TranslateCtrl controller
 *
 *
 */
angular.module('app').controller('TranslateCtrl', function ($translate, $scope) {
    $scope.num = 0;
    $scope.testStr = "click times";
    $scope.changeLanguage = function (langKey) {
        $translate.uses(langKey);
        $scope.num ++;
        $scope.testStr += $scope.num;
    };
});
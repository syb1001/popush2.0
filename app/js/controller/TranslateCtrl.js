/**
 * Created by yunqing on 10/23/13.
 */

/**
 * TranslateCtrl controller
 *
 *
 */
angular.module('app').controller('TranslateCtrl', function ($translate, $scope) {
    $scope.changeLanguage = function (langKey) {
        $translate.uses(langKey);
    };
});
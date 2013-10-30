/**
 * Created by yunqing on 10/23/13.
 */

/**
 * LoginCtrl controller
 *
 *
 */
angular.module('app').controller("LoginCtrl", function($scope){
    $scope.$model = {
        message: "login page"
    };
    $scope.isLogIn = true;
    $scope.userNameLogIn = "";
    $scope.userPasswordLogIn = "";
    $scope.userNameSignUp = "";
    $scope.userPasswordSignUp = "";

    $scope.submitLogIn = function() {
        if (this.text) {
            alert("Log In Successfully!");

        }
    };
})


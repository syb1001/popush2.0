function LoginCtrl($scope, $location, $cookies, socket, GlobalCtrl) {

	$scope.message = '';
	$scope.showMessage = false;

	socket.on('login', function(data) {
		console.log('logged in!');
		if (data.err) {
			delete $cookies.sid;
			$scope.message = 'LOGIN_FAILED';
			$scope.showMessage = true;
		} else {
			$cookies.sid = data.sid;
			$scope.message = 'LOGIN_SUCCESS';
			$scope.showMessage = true;
			GlobalCtrl.user = data.user;
			GlobalCtrl.currentPath = '/' + data.user.name;
			$location.path('/myfile');
		}
	});

	$scope.loginSubmit = function() {
		if (!$scope.loginName) {
			$scope.message = 'USERNAME_REQUIRED';
			$scope.showMessage = true;
		} else if (!$scope.loginPassword) {
			$scope.message = 'PASSWORD_REQUIRED';
			$scope.showMessage = true;
		} else {
			socket.emit('login', {
				name: $scope.loginName,
				password: $scope.loginPassword
			});
		}
	};

	$scope.closeMessage = function() {
		$scope.showMessage = false;	
	};
}
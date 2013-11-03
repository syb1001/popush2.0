function RegisterCtrl($scope, socket, GlobalCtrl) {
	
	$scope.message = '';
	$scope.showMessage = false;

	socket.on('register', function(data) {
		if (data.err) {
			$scope.message = 'REGISTER_FAILED';
			$scope.showMessage = true;
		} else {
			$scope.message = 'REGISTER_SUCCESS';
			$scope.showMessage = true;
		}
	});

	$scope.registerSubmit = function() {
		if (!$scope.registerName) {
			$scope.message = 'USERNAME_REQUIRED';
			$scope.showMessage = true;
		} else if (!$scope.registerPassword) {
			$scope.message = 'PASSWORD_REQUIRED';
			$scope.showMessage = true;
		} else if ($scope.registerPassword != $scope.confirmPassword) {
			$scope.message = 'PASS_INCONSISTANT';
			$scope.showMessage = true;
		} else if ($scope.registerName.length < 6 || $scope.registerName.length > 20) {
			$scope.message = 'USERNAME_LEN_WRONG';
			$scope.showMessage = true;
		} else {
			socket.emit('register', {
				name: $scope.registerName,
				password: $scope.registerPassword, 
				avatar: 'img/character.png'
			});
		}
	}

	$scope.closeMessage = function() {
		$scope.showMessage = false;
	};
}
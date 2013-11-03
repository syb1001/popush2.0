function ModalChangePasswordCtrl($scope, $modalInstance, socket) {

	$scope.ok = function(oldPassword, newPassword, confirmPassword) {
		if (!oldPassword) {
			$scope.message = 'PASSWORD_REQUIRED';
		} else if (!newPassword) {
			$scope.message = 'NEWPASS_REQUIRED';
		} else if (newPassword != confirmPassword) {
			$scope.message = 'PASS_INCONSISTANT';
		} else {
			socket.emit('password', {
				password: oldPassword,
				newPassword: newPassword
			});
		}
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	socket.on('password', function(data) {
		if (data.err) {
			$scope.message = 'WRONG_PASSWORD';
		} else {
			$modalInstance.close();
		}
	});
}

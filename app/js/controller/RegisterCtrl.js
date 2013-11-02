function RegisterCtrl($scope, socket, GlobalCtrl) {
	
	$scope.message = '请输入注册信息~';

	socket.on('register', function(data) {
		if (data.err) {
			$scope.message = '注册信息有误，请重新输入';
		} else {
			$scope.message = '注册成功！';
		}
	});

	$scope.registerSubmit = function() {
		if ($scope.registerName.length == 0) {
			return;
		}
		if ($scope.registerPassword != $scope.confirmPassword) {
			$scope.message = '两次输入的密码不一致，请重新输入';
		} else if ($scope.registerName.length < 6 || $scope.registerName.length > 20) {
			$scope.message = '用户名的长度必须在6-20之间';
		} else {
			socket.emit('register', {
				name: $scope.registerName,
				password: $scope.registerPassword, 
				avatar: 'images/back.png'
			});
		}
	}
}
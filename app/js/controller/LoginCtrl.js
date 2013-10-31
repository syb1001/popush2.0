function LoginCtrl($scope, $location, socket, GlobalCtrl) {

	$scope.message = '请输入登录信息~';

	socket.on('login', function(data) {
		console.log('logged in!');
		if(data.err) {
			$scope.message = '用户名或密码错误，请重新输入';
		} else {
			$scope.message = '登陆成功!';
			$location.path('/dashboard');
		}
	});

	$scope.loginSubmit = function() {
		socket.emit('login', {
			name: $scope.loginName,
			password: $scope.loginPassword
		})
	};
}